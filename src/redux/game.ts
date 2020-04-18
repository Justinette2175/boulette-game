import { createReducer, createAction } from "redux-act";
import firebase from "firebase";
import moment from "moment";
import Cookies from "js-cookie";
import "firebase/firestore";
import randomString from "randomstring";
import {
  Game,
  GameId,
  Username,
  TeamId,
  Store,
  User,
  Team,
  UserId,
  Word,
  Round,
  WordId,
  Time,
} from "../types";
import Firebase from "../services/firebase";
import { updateTimer } from "./computer";
import { NUMBER_OF_ROUNDS, SECOND_DURATION_OF_TURN } from "../constants";
import { calculateCumulativeScore } from "../utils";

import { addUserToComputerAndSetCookie, regularTimer } from "./computer";

const INITIAL_TEAMS = [
  {
    name: "The Birds",
    id: "1",
  },
  {
    name: "The Bees",
    id: "2",
  },
];

const db = Firebase.db;

export const updateGame = createAction<Game>("UPDATE_GAME");
export const updateGameSubcollection = createAction<{
  values: Array<any>;
  key: string;
}>("UPDATE_USERS");

export const updateTeams = createAction<Array<Team>>("UPDATE_TEAMS");
export const updateUserTeam = createAction<{
  username: Username;
  teamId: TeamId;
}>();

export const createGame = function (ownerName: Username) {
  return async (dispatch: any, getState: () => Store) => {
    const initialGameId = getState().game.id;
    if (!initialGameId) {
      let batch = db.batch();
      const newGameId = randomString.generate({
        length: 5,
        charset: "alphabetic",
        capitalization: "uppercase",
      });
      const newGameRef = db.collection("games").doc(newGameId);
      const ownerUserRef = newGameRef.collection("users").doc();
      batch.set(newGameRef, { owner: ownerUserRef.id });
      batch.set(ownerUserRef, {
        name: ownerName,
        createdAt: Date.now(),
        teamId: "1",
      });
      INITIAL_TEAMS.forEach((t) => {
        let teamRef = newGameRef.collection("teams").doc(t.id);
        batch.set(teamRef, t);
      });
      try {
        await batch.commit();
        dispatch(updateGame({ id: newGameRef.id }));
        Cookies.set("gameId", newGameRef.id, { expires: 1 });
        dispatch(addUserToComputerAndSetCookie(ownerUserRef.id));
        dispatch(listenToGame(newGameRef));
      } catch (e) {
        console.log("error", e);
      }
    }
  };
};

const findUserInitialTeam = function (users: Array<any>) {
  let playersPerTeam = [0, 0];
  users.forEach((user) => {
    const d = user.data ? user.data() : user;
    if (d.teamId === "1") {
      playersPerTeam[0] += 1;
    } else if (d.teamId === "2") {
      playersPerTeam[1] += 1;
    }
  });
  console.log("players per team", playersPerTeam);
  return playersPerTeam[1] < playersPerTeam[0] ? "2" : "1";
};

export const joinGame = function (name: Username, gameId: GameId) {
  const gameRef = db.collection("games").doc(gameId);
  return async (dispatch: any, getState: () => Store) => {
    try {
      const newUserId = await db.runTransaction(async function (
        transaction: any
      ) {
        const gameDoc = await transaction.get(gameRef);
        if (!gameDoc.exists) {
          throw "Document does not exist!";
        }
        const newUserRef = gameRef.collection("users").doc();
        await transaction.set(newUserRef, {
          name,
          createdAt: Date.now(),
        });
        return newUserRef.id;
      });
      dispatch(listenToGame(gameRef));
      dispatch(updateGame({ id: gameId }));
      Cookies.set("gameId", gameId, { expires: 1 });
      const currentUsers = await gameRef.collection("users").get();
      const initialUserTeam = findUserInitialTeam(currentUsers);
      console.log("Initial user tean is", initialUserTeam);
      await gameRef
        .collection("users")
        .doc(newUserId)
        .update({ teamId: initialUserTeam });
      dispatch(addUserToComputerAndSetCookie(newUserId));
    } catch (e) {
      console.log(e);
    }
  };
};

export const addPlayerOnComputer = function (name: Username) {
  return async (dispatch: any, getState: () => Store) => {
    const { id, users } = getState().game;
    const teamId = findUserInitialTeam(users);
    if (!!id) {
      const newUser: User = {
        name,
        createdAt: Date.now(),
        teamId,
      };
      const newUserRef = db
        .collection("games")
        .doc(id)
        .collection("users")
        .doc();
      await newUserRef.set(newUser);
      dispatch(addUserToComputerAndSetCookie(newUserRef.id));
    }
  };
};

const makeRounds = (): Array<Round> =>
  Array.apply(null, Array(NUMBER_OF_ROUNDS)).map((_, i) => ({
    index: i + 1,
    wordsLeft: [],
    wordsGuessed: [],
  }));

export const getNextPlayer = (
  newTeamId: TeamId,
  teams: Array<Team>,
  users: Array<User>
): User => {
  const newTeam = teams.find((t) => t.id === newTeamId);
  const orderedTeamUsers = users
    .filter((u) => u.teamId === newTeamId)
    .sort((a, b) => a.createdAt - b.createdAt);
  let lastPlayerIndex = -1;
  if (newTeam.lastPlayerId) {
    lastPlayerIndex = orderedTeamUsers.findIndex(
      (u) => u.id === newTeam.lastPlayerId
    );
    if (lastPlayerIndex === orderedTeamUsers.length - 1) {
      lastPlayerIndex = -1;
    }
  }
  return orderedTeamUsers[lastPlayerIndex + 1];
};

const batchSetLastPlayerIdForTeam = (
  batch: any,
  teamId: TeamId,
  id: UserId,
  gameRef: any
) => {
  batch.update(gameRef.collection("teams").doc(teamId), {
    lastPlayerId: id,
  });
  return batch;
};

const batchCreateRounds = (batch: any, words: Array<Word>, gameRef: any) => {
  let firstRoundIndex;
  const rounds: Array<Round> = makeRounds();
  rounds.forEach((r) => {
    const roundRef = gameRef.collection("rounds").doc();
    if (r.index === 1) {
      firstRoundIndex = roundRef.id;
    }
    const roundData = {
      ...r,
      wordsLeft: words.map((w) => w.id),
      score: { "1": 0, "2": 0 },
    };
    batch.set(roundRef, roundData);
  });
  return { batch, firstRoundIndex };
};

export const startGame = function () {
  return async (dispatch: any, getState: () => Store) => {
    const { game } = getState();
    const gameId = game.id;
    const { words, teams, users } = game;
    const gameRef = db.collection("games").doc(gameId);
    let batch = db.batch();
    const newTeamId = "1";
    const currentUser = getNextPlayer(newTeamId, teams, users);
    batch = batchSetLastPlayerIdForTeam(
      batch,
      newTeamId,
      currentUser.id,
      gameRef
    );
    const batchRounds = batchCreateRounds(batch, words, gameRef);
    batch = batchRounds.batch;
    batch.update(gameRef, {
      currentRound: batchRounds.firstRoundIndex,
      currentTeam: newTeamId,
      currentUser: currentUser.id,
    });
    await batch.commit();
  };
};

export const assignUserToTeam = function (userId: UserId, teamId: TeamId) {
  return async (dispatch: any, getState: () => Store) => {
    const gameId = getState().game.id;
    const gameRef = db.collection("games").doc(gameId);
    await gameRef.collection("users").doc(userId).update({ teamId });
  };
};

export const startNextTurn = function () {
  return async (dispatch: any, getState: () => Store) => {
    const { id: gameId, currentTeam, teams, users } = getState().game;
    let batch = db.batch();
    const newTeamId = currentTeam === "1" ? "2" : "1";
    const nextPlayer = getNextPlayer(newTeamId, teams, users);
    const gameRef = db.collection("games").doc(gameId);
    if (nextPlayer) {
      batch.update(gameRef, {
        currentTeam: newTeamId,
        currentUser: nextPlayer.id,
      });
      batch.update(gameRef.collection("teams").doc(newTeamId), {
        lastPlayerId: nextPlayer.id,
      });
    }
    await batch.commit();
  };
};

/***********************
 * START A USER'S TURN *
 * - find the next word within the current round's remaining words list
 * - If there is a next word:
 *    - Send to db the timestamp for the end of the user's turn either based on remaining seconds or on duration of turn
 *    - Send to db the next word as current word
 *- If there isn't a next word ?
 ***********************/

export const startMiming = function () {
  return async (dispatch: any, getState: () => Store) => {
    const {
      id: gameId,
      currentRound,
      words,
      rounds,
      remainingTimeForNextRound,
    } = getState().game;
    const round = rounds.find((r) => r.id === currentRound);
    const { wordsLeft } = round;
    const nextWord = getNextWord(wordsLeft, words);
    const gameRef = db.collection("games").doc(gameId);
    if (nextWord) {
      let endOfCurrentTurn;
      if (remainingTimeForNextRound) {
        endOfCurrentTurn = moment()
          .add(remainingTimeForNextRound.seconds, "s")
          .add(remainingTimeForNextRound.minutes, "m")
          .format();
      } else {
        endOfCurrentTurn = moment().add(SECOND_DURATION_OF_TURN, "s").format();
      }
      await gameRef.update({
        currentWord: nextWord,
        endOfCurrentTurn,
        remainingTimeForNextRound: null,
      });
    } else {
      console.log("it's the end of the turn...");
    }
  };
};

let timerInterval: any;
const COUNTDOWN_INTERVAL = 500;

const updateCountDown = function (endOfCurrentTurn: string) {
  return (dispatch: any) => {
    const differenceInMilliseconds = moment().diff(moment(endOfCurrentTurn));
    const seconds = -moment.duration(differenceInMilliseconds).seconds();
    const minutes = -moment.duration(differenceInMilliseconds).minutes();
    dispatch(updateTimer({ seconds: seconds > 0 ? seconds : 0, minutes }));
  };
};

const timerIsFinished = function (endOfCurrentTurn: string): boolean {
  const differenceInMilliseconds = moment().diff(moment(endOfCurrentTurn));
  const seconds = -moment.duration(differenceInMilliseconds).seconds();
  return seconds < 0;
};

const endPlayerTurn = function (userIsOnComputer: boolean, gameId: GameId) {
  return async (dispatch: any) => {
    if (userIsOnComputer) {
      await db.collection("games").doc(gameId).update({
        endOfCurrentTurn: null,
        currentWord: null,
        remainingTimeForNextRound: null,
      });
      dispatch(startNextTurn());
    }
  };
};

const startCountdown = function (endOfCurrentTurn: string) {
  return async (dispatch: any, getState: () => Store) => {
    const {
      game: { currentUser, id },
      computer: { users },
    } = getState();
    const userIsOnComputer = !!currentUser && users.indexOf(currentUser) > -1;
    dispatch(updateCountDown(endOfCurrentTurn));
    if (!timerInterval) {
      timerInterval = setInterval(() => {
        const callback = async function () {
          if (timerIsFinished(endOfCurrentTurn)) {
            dispatch(endPlayerTurn(userIsOnComputer, id));
          } else {
            dispatch(updateCountDown(endOfCurrentTurn));
          }
        };
        callback();
      }, COUNTDOWN_INTERVAL);
    }
  };
};

const getNextWord = function (
  roundWordsLeft: Array<WordId>,
  gameWords: Array<Word>
): Word {
  if (roundWordsLeft.length > 0) {
    const nextWordId =
      roundWordsLeft[Math.floor(Math.random() * roundWordsLeft.length)];
    return gameWords.find((w) => w.id === nextWordId);
  } else return null;
};

export const markWordAsFound = function (word: Word) {
  return async (dispatch: any, getState: () => Store) => {
    const {
      id: gameId,
      currentRound,
      words,
      rounds,
      currentTeam,
    } = getState().game;
    const round = rounds.find((r) => r.id === currentRound);
    const { wordsLeft, score } = round;
    const indexOfLastWord = wordsLeft.indexOf(word.id);
    wordsLeft.splice(indexOfLastWord, 1);
    const gameRef = db.collection("games").doc(gameId);
    let batch = db.batch();
    const roundRef = gameRef.collection("rounds").doc(currentRound);
    const newTeamScore: number = score[currentTeam] + 1;

    // Update round with new score
    // Update round with words left
    batch.update(roundRef, {
      wordsLeft: firebase.firestore.FieldValue.arrayRemove(word.id),
      wordsGuessed: firebase.firestore.FieldValue.arrayUnion(word.id),
      [`score.${currentTeam}`]: newTeamScore,
    });
    // Set next currentWord
    const nextWord = getNextWord(wordsLeft, words);
    batch.update(gameRef, { currentWord: nextWord });

    // Handle end of round
    if (!nextWord) {
      const currentRoundIndex = round.index;
      if (currentRoundIndex === NUMBER_OF_ROUNDS) {
        const winningTeamId = getGameWinner(rounds);
        batch.update(gameRef, { winner: winningTeamId });
        Cookies.remove("gameId");
        Cookies.remove("users");
      } else {
        batch = handleEndRound(
          getState,
          batch,
          gameRef,
          rounds,
          currentRoundIndex
        );
      }
    }
    await batch.commit();
  };
};

const getGameWinner = function (rounds: Array<Round>) {
  const cumulativeScore = calculateCumulativeScore(rounds);
  const team1Score = cumulativeScore["1"];
  const team2Score = cumulativeScore["2"];
  return team1Score === team2Score
    ? "both"
    : team1Score > team2Score
    ? "1"
    : "2";
};

const handleEndRound = function (
  getState: () => Store,
  batch: any,
  gameRef: any,
  rounds: Array<Round>,
  currentRoundIndex: number
) {
  const remainingTimeForNextRound = getState().computer.timer;
  const nextRound = rounds.find((r) => r.index === currentRoundIndex + 1);
  batch.update(gameRef, {
    currentRound: nextRound.id,
    remainingTimeForNextRound,
    endOfCurrentTurn: null,
  });
  return batch;
};

const listenToGame = (gameRef: any) => {
  return async (dispatch: any, getState: () => Store) => {
    gameRef.onSnapshot(function (c: any) {
      dispatch(handleGameUpdate(c));
    });

    gameRef.collection("users").onSnapshot(function (c: any) {
      dispatch(handleGameSubcollectionData(c, "users"));
    });
    gameRef.collection("teams").onSnapshot(function (c: any) {
      dispatch(handleGameSubcollectionData(c, "teams"));
    });
    gameRef.collection("words").onSnapshot(function (c: any) {
      dispatch(handleGameSubcollectionData(c, "words"));
    });
    gameRef.collection("rounds").onSnapshot(function (c: any) {
      dispatch(handleGameSubcollectionData(c, "rounds"));
    });
  };
};

const handleGameUpdate = function (c: any) {
  return (dispatch: any, getState: () => Store) => {
    const data = c.data();
    console.log(data);
    const {
      game: { endOfCurrentTurn },
    } = getState();
    if (
      data.endOfCurrentTurn &&
      data.endOfCurrentTurn !== endOfCurrentTurn &&
      !timerInterval
    ) {
      dispatch(startCountdown(data.endOfCurrentTurn));
    }
    if (
      (data.remainingTimeForNextRound || !data.endOfCurrentTurn) &&
      timerInterval
    ) {
      dispatch(updateTimer(data.remainingTimeForNextRound || regularTimer));
      clearInterval(timerInterval);
      timerInterval = null;
    }
    dispatch(updateGame({ ...data, id: c.id }));
  };
};

const handleGameSubcollectionData = function (
  c: Array<any>,
  collectionName = "string"
) {
  return (dispatch: any) => {
    const data: Array<User> = [];
    c.forEach((u: any) => data.push({ id: u.id, ...u.data() }));
    dispatch(updateGameSubcollection({ values: data, key: collectionName }));
  };
};

export const loadGame = function (gameId: GameId) {
  return async (dispatch: any) => {
    const gameRef = db.collection("games").doc(gameId);
    const game = await gameRef.get();
    if (game.exists) {
      dispatch(handleGameUpdate(game));
      const collections = ["users", "rounds", "teams", "words"];
      Promise.all(
        collections.map(async (collectionName) => {
          const data = await gameRef.collection(collectionName).get();
          dispatch(handleGameSubcollectionData(data, collectionName));
        })
      );
      dispatch(listenToGame(gameRef));
    }
  };
};

const initialState: Game = {
  id: null,
  owner: null,
  rounds: [],
  currentRound: null,
  users: [],
  currentTeam: null,
  currentUser: null,
  words: [],
  teams: [],
  endOfCurrentTurn: null,
};

const game = createReducer<Game>({}, initialState);

game.on(updateGame, (state, payload) => ({ ...state, ...payload }));

game.on(updateGameSubcollection, (state, payload) => ({
  ...state,
  [payload.key]: payload.values,
}));

export default game;
