import { createReducer, createAction } from "redux-act";
import firebase from "firebase";
import "firebase/firestore";
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
} from "../types";
import Firebase from "../services/firebase";
import { NUMBER_OF_ROUNDS } from "../constants";

import { addUserToComputer } from "./computer";

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

const listenToGame = (dispatch: any, gameRef: any) => {
  gameRef.onSnapshot(function (c: any) {
    dispatch(updateGame(c.data()));
  });
  gameRef.collection("users").onSnapshot(function (c: any) {
    const users: Array<User> = [];
    c.forEach((u: any) => users.push({ id: u.id, ...u.data() }));
    dispatch(updateGameSubcollection({ values: users, key: "users" }));
  });
  gameRef.collection("teams").onSnapshot(function (c: any) {
    const teams: Array<Team> = [];
    c.forEach((t: any) => teams.push({ id: t.id, ...t.data() }));
    dispatch(updateGameSubcollection({ values: teams, key: "teams" }));
  });
  gameRef.collection("words").onSnapshot(function (c: any) {
    const words: Array<Word> = [];
    c.forEach((w: any) => words.push({ id: w.id, ...w.data() }));
    dispatch(updateGameSubcollection({ values: words, key: "words" }));
  });
  gameRef.collection("rounds").onSnapshot(function (c: any) {
    console.log("Getting rounds info");
    const rounds: Array<Round> = [];
    c.forEach((r: any) => rounds.push({ id: r.id, ...r.data() }));
    dispatch(updateGameSubcollection({ values: rounds, key: "rounds" }));
  });
};

export const createGame = function (ownerName: Username) {
  return async (dispatch: any, getState: () => Store) => {
    const initialGameId = getState().game.id;
    if (!initialGameId) {
      let batch = db.batch();
      const newGameRef = db.collection("games").doc();
      const ownerUserRef = newGameRef.collection("users").doc();
      batch.set(newGameRef, { owner: ownerUserRef.id });
      batch.set(ownerUserRef, { name: ownerName, createdAt: Date.now() });
      INITIAL_TEAMS.forEach((t) => {
        let teamRef = newGameRef.collection("teams").doc(t.id);
        batch.set(teamRef, t);
      });
      try {
        await batch.commit();
        dispatch(updateGame({ id: newGameRef.id }));
        dispatch(addUserToComputer(ownerUserRef.id));
        listenToGame(dispatch, newGameRef);
      } catch (e) {
        console.log("error", e);
      }
    }
  };
};

export const joinGame = function (name: Username, gameId: GameId) {
  const gameRef = db.collection("games").doc(gameId);
  return async (dispatch: any) => {
    try {
      await db.runTransaction(async function (transaction: any) {
        const gameDoc = await transaction.get(gameRef);
        if (!gameDoc.exists) {
          throw "Document does not exist!";
        }
        dispatch(updateGame({ id: gameId }));
        const newUserRef = gameRef.collection("users").doc();
        dispatch(addUserToComputer(newUserRef.id));
        await transaction.set(newUserRef, { name, createdAt: Date.now() });
        listenToGame(dispatch, gameRef);
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const addPlayerOnComputer = function (name: Username) {
  return async (dispatch: any, getState: () => Store) => {
    const gameId = getState().game.id;
    if (!!gameId) {
      const newUser: User = {
        name,
        createdAt: Date.now(),
      };
      const newUserRef = db
        .collection("games")
        .doc(gameId)
        .collection("users")
        .doc();
      await newUserRef.set(newUser);
      dispatch(addUserToComputer(newUserRef.id));
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

export const startGame = function () {
  return async (dispatch: any, getState: () => Store) => {
    const { game } = getState();
    const gameId = game.id;
    const { words, teams, users } = game;
    const gameRef = db.collection("games").doc(gameId);
    let batch = db.batch();
    const newTeamId = "1";
    const currentUser = getNextPlayer(newTeamId, teams, users);
    let firstRoundIndex;
    batch.update(gameRef.collection("teams").doc(newTeamId), {
      lastPlayerId: currentUser.id,
    });
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
    batch.update(gameRef, {
      currentRound: firstRoundIndex,
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
    batch.update(gameRef, {
      currentTeam: newTeamId,
      currentUser: nextPlayer.id,
    });
    batch.update(gameRef.collection("teams").doc(newTeamId), {
      lastPlayerId: nextPlayer.id,
    });
    await batch.commit();
  };
};

export const startMiming = function () {
  return async (dispatch: any, getState: () => Store) => {
    const { id: gameId, currentRound, words, rounds } = getState().game;
    const round = rounds.find((r) => r.id === currentRound);
    const { wordsLeft } = round;
    const nextWord = getNextWord(wordsLeft, words);
    const gameRef = db.collection("games").doc(gameId);
    if (nextWord) {
      gameRef.update({ currentWord: nextWord });
    } else {
      console.log("it's the end of the turn...");
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
    batch.update(roundRef, {
      wordsLeft: firebase.firestore.FieldValue.arrayRemove(word.id),
      wordsGuessed: firebase.firestore.FieldValue.arrayUnion(word.id),
      [`score.${currentTeam}`]: newTeamScore,
    });
    const nextWord = getNextWord(wordsLeft, words);
    batch.update(gameRef, { currentWord: nextWord });
    if (!nextWord) {
      const currentRoundIndex = round.index;
      if (currentRoundIndex === NUMBER_OF_ROUNDS) {
        console.log("It's the end of the game");
      } else {
        const nextRound = rounds.find((r) => r.index === currentRoundIndex + 1);
        batch.update(gameRef, { currentRound: nextRound.id });
      }
    }
    await batch.commit();
  };
};

const initialState: Game = {
  id: null,
  owner: null,
  rounds: [],
  currentRound: null,
  countdown: null,
  users: [],
  currentTeam: null,
  currentUser: null,
  words: [],
  teams: [],
};

const game = createReducer<Game>({}, initialState);

game.on(updateGame, (state, payload) => ({ ...state, ...payload }));

game.on(updateGameSubcollection, (state, payload) => ({
  ...state,
  [payload.key]: payload.values,
}));

export default game;
