import ReduxStore from "../../redux/store";
import randomString from "randomstring";
import moment from "moment";
import {
  GameId,
  UserId,
  User,
  TeamId,
  Username,
  Word,
  WordId,
  Round,
  Time,
  JitsyId,
} from "../../types";
import FirebaseGameInterface from "../firebase/FirebaseGameInterface";
import { calculateCumulativeScore } from "../../utils";

import { NUMBER_OF_ROUNDS } from "../../constants";

import {
  addUserToComputer,
  updateId,
  setVideoMuted,
  setAudioMuted,
} from "../../redux/computer";
import { updateGame, updateGameSubcollection } from "../../redux/game";
import CookiesService from "../cookies/CookiesService";
import Countdown from "./Countdown";

export interface createGameArgs {
  ownerName: string;
  wordsPerPlayer: number;
  secondsPerTurn: number;
}

const makeRounds = (words: Array<Word>): Array<Round> =>
  Array.apply(null, Array(NUMBER_OF_ROUNDS)).map((_, i) => ({
    index: i + 1,
    wordsGuessed: [],
    wordsLeft: words.map((w) => w.id),
    score: { "1": 0, "2": 0 },
  }));

const getEndOfTurn = (
  remainingTimeForNextRound: Time,
  secondsPerTurn: number
) => {
  if (remainingTimeForNextRound) {
    return moment()
      .add(remainingTimeForNextRound.seconds + 1, "s")
      .add(remainingTimeForNextRound.minutes, "m")
      .format();
  } else {
    return moment().add(secondsPerTurn, "s").format();
  }
};

const getGameWinner = (rounds: Array<Round>) => {
  const cumulativeScore = calculateCumulativeScore(rounds);
  const team1Score = cumulativeScore["1"];
  const team2Score = cumulativeScore["2"];
  return team1Score === team2Score
    ? "both"
    : team1Score > team2Score
    ? "1"
    : "2";
};

const INITIAL_TEAMS = [
  {
    name: "The Greens",
    id: "1",
  },
  {
    name: "The Pinks",
    id: "2",
  },
];

class Game {
  id: GameId;
  store: any;
  countdown: Countdown;

  constructor(gameId?: GameId) {
    this.id = gameId || this._generateGameId();
    this.store = new FirebaseGameInterface(this.id);
  }

  create = async ({
    ownerName,
    wordsPerPlayer,
    secondsPerTurn,
  }: createGameArgs) => {
    let batch = this.store.db.batch();
    const [ownerId, newBatch] = await this.store.createOwnerUser(
      { ownerName },
      batch
    );

    INITIAL_TEAMS.forEach((t) => {
      let teamRef = this.store.teamsRef.doc(t.id);
      newBatch.set(teamRef, t);
    });

    newBatch.update(this.store.gameRef, {
      stage: "WAITING_FOR_PLAYERS",
      wordsPerPlayer,
      secondsPerTurn,
    });

    try {
      await newBatch.commit();
      ReduxStore.dispatch(updateGame({ id: this.id }));
      CookiesService.setGameId(this.id);
      this._addUserToComputer(ownerId);
      this._listenToGame();
    } catch (e) {
      console.log("error", e);
    }
  };

  load = async () => {
    console.log("Loading");
    return await this._fetchAllDataAndStartListening();
  };

  join = async ({ userName }: { userName: Username }) => {
    try {
      const newUserId = await this.store.db.runTransaction(
        async (transaction: any) => {
          const gameDoc = await transaction.get(this.store.gameRef);
          console.log("Game doc is", gameDoc.data());
          if (!gameDoc.exists) {
            throw new Error("This game ID does not exist...");
          }
          const gameData = gameDoc.data();
          if (
            !gameData ||
            !gameData.stage ||
            gameData.stage !== "WAITING_FOR_PLAYERS"
          ) {
            throw new Error(
              "This game has already started, it's too late to join!"
            );
          }
          const newUserRef = this.store.usersRef.doc();
          await transaction.set(newUserRef, {
            name: userName,
            createdAt: Date.now(),
          });
          return newUserRef.id;
        }
      );
      this._listenToGame();
      ReduxStore.dispatch(updateGame({ id: this.id }));
      CookiesService.setGameId(this.id);
      const currentUsers = await this.store.usersRef.get();
      const initialUserTeam = this._findUserInitialTeam(currentUsers);
      await this.store.usersRef
        .doc(newUserId)
        .update({ teamId: initialUserTeam });
      this._addUserToComputer(newUserId);
    } catch (e) {
      console.log("erro r is", e);
      throw e;
    }
  };

  startChoseWords = async () => {
    await this.store.gameRef.update({ stage: "CHOSING_WORDS" });
  };

  startReviewTeams = async () => {
    await this.store.gameRef.update({ stage: "REVIEWING_TEAMS" });
  };

  start = async () => {
    const { words } = ReduxStore.getState().game;
    let batch = this.store.db.batch();
    const newTeamId = "1";
    const currentUser = this._getNextPlayer(newTeamId);
    batch.update(this.store.teamsRef.doc(newTeamId), {
      lastPlayerId: currentUser.id,
    });
    const rounds: Array<Round> = makeRounds(words);
    let [newBatch, firstRoundIndex] = this.store.initializeRounds(
      { rounds },
      batch
    );
    newBatch.update(this.store.gameRef, {
      stage: "PLAYING",
      currentRound: firstRoundIndex,
      currentTeam: newTeamId,
      currentUser: currentUser.id,
    });
    await newBatch.commit();
  };

  addPlayerOnDevice = async (name: string) => {
    const { jitsyId } = ReduxStore.getState().computer;
    const teamId = this._findUserInitialTeam();
    const newUser: User = {
      name,
      createdAt: Date.now(),
      teamId,
      jitsyId,
    };
    const newUserRef = this.store.usersRef.doc();
    await newUserRef.set(newUser);
    this._addUserToComputer(newUserRef.id);
  };

  storeJitsyId = async (jitsyId: JitsyId) => {
    console.log("store jitsyId", jitsyId);
    const { users } = ReduxStore.getState().computer;
    ReduxStore.dispatch(updateId(jitsyId));
    users.forEach((u) => {
      this.store.usersRef.doc(u).update({ jitsyId });
    });
  };

  startMiming = async () => {
    const {
      currentRound,
      words,
      rounds,
      remainingTimeForNextRound,
      currentWord,
      secondsPerTurn,
    } = ReduxStore.getState().game;
    if (!currentWord) {
      const round = rounds.find((r) => r.id === currentRound);
      const { wordsLeft } = round;
      const nextWord = this._getNextWord(wordsLeft, words);
      if (nextWord) {
        const endOfCurrentTurn = getEndOfTurn(
          remainingTimeForNextRound,
          secondsPerTurn
        );
        await this.store.startTurn({
          word: nextWord,
          endOfCurrentTurn: endOfCurrentTurn || null,
        });
      } else {
        this._handleEndOfRound();
      }
    }
  };

  handleFoundWord = async (word: Word) => {
    const {
      currentRound,
      words,
      rounds,
      currentTeam,
    } = ReduxStore.getState().game;
    const round = rounds.find((r) => r.id === currentRound);
    const { wordsLeft, score } = round;
    const indexOfLastWord = wordsLeft.indexOf(word.id);
    wordsLeft.splice(indexOfLastWord, 1);
    const newScore: number = score[currentTeam] + 1;
    const nextWord = this._getNextWord(wordsLeft, words);
    await this.store.logWordGuessed({
      roundId: currentRound,
      guessedWord: word,
      nextWord,
      currentTeam,
      newScore,
    });

    // Handle end of round
    if (!nextWord) {
      this._handleEndOfRound();
    }
  };

  terminate = () => {
    this._end();
  };

  _findUserInitialTeam = (overrideUsers?: Array<any>) => {
    const { users } = ReduxStore.getState().game;
    let playersPerTeam = [0, 0];
    const localUsers = overrideUsers || users;
    localUsers.forEach((user) => {
      const d = user.data ? user.data() : user;
      if (d.teamId === "1") {
        playersPerTeam[0] += 1;
      } else if (d.teamId === "2") {
        playersPerTeam[1] += 1;
      }
    });
    return playersPerTeam[1] < playersPerTeam[0] ? "2" : "1";
  };

  _generateGameId = () => {
    return randomString.generate({
      length: 5,
      charset: "alphabetic",
      capitalization: "uppercase",
    });
  };

  _fetchAllDataAndStartListening = async () => {
    console.log("fetching data");
    const game = await this.store.gameRef.get();
    console.log("game", game);
    if (game.exists) {
      this._handleGameUpdate(game);
      const collections = ["users", "rounds", "teams", "words"];
      await Promise.all(
        collections.map(async (collectionName) => {
          const data = await this.store[`${collectionName}Ref`].get();
          this._handleGameSubcollectionData(data, collectionName);
        })
      );
      this._listenToGame();
    }
  };

  _addUserToComputer = async (userId: UserId) => {
    CookiesService.addUserToUsers(userId);
    ReduxStore.dispatch(addUserToComputer(userId));
  };

  _listenToGame = async () => {
    this.store.listenToGame((c: any) => {
      this._handleGameUpdate(c);
    });
    this.store.listenToUsers((c: any) => {
      this._handleGameSubcollectionData(c, "users");
    });
    this.store.listenToTeams((c: any) => {
      this._handleGameSubcollectionData(c, "teams");
    });
    this.store.listenToWords((c: any) => {
      this._handleGameSubcollectionData(c, "words");
    });
    this.store.listenToRounds((c: any) => {
      this._handleGameSubcollectionData(c, "rounds");
    });
  };

  _handleGameUpdate = (c: any) => {
    const data = c.data();
    const {
      game: { currentUser, stage },
      computer: { users, videoMuted, audioMuted },
    } = ReduxStore.getState();

    if (data.stage === "PLAYING" && !data.endOfCurrentTurn) {
      if (this.countdown) {
        this.countdown.reset(data.remainingTimeForNextRound || null);
      } else {
        this.countdown = new Countdown(data.remainingTimeForNextRound || null);
      }
    }
    if (data.endOfCurrentTurn) {
      console.log("Game update data.end of current");
      this._startLocalCountDown(data.endOfCurrentTurn);
    }

    if (stage === "PLAYING" && data.currentUser !== currentUser) {
      if (audioMuted) {
        ReduxStore.dispatch(setAudioMuted(false));
      }
      if (users.indexOf(currentUser) > -1 && !!videoMuted) {
        ReduxStore.dispatch(setVideoMuted(false));
      } else if (users.indexOf(currentUser) < 0 && !videoMuted) {
        ReduxStore.dispatch(setVideoMuted(true));
      }
    }

    ReduxStore.dispatch(updateGame({ ...data, id: c.id }));
  };

  _handleGameSubcollectionData = (c: Array<any>, collectionName = "string") => {
    const data: Array<User> = [];
    c.forEach((u: any) => data.push({ id: u.id, ...u.data() }));
    ReduxStore.dispatch(
      updateGameSubcollection({ values: data, key: collectionName })
    );
  };

  _startLocalCountDown = (end: string) => {
    const onCountdownEnd = () => this._endPlayerTurn(this.id);
    if (!this.countdown) {
      this.countdown = new Countdown();
    }
    this.countdown.start(end, onCountdownEnd);
  };

  _endPlayerTurn = async (gameId: GameId) => {
    await this.store.gameRef.update({
      endOfCurrentTurn: null,
      currentWord: null,
      remainingTimeForNextRound: null,
    });
    this._startNextTurn();
  };

  _startNextTurn = async () => {
    const { currentTeam } = ReduxStore.getState().game;
    const newTeamId = currentTeam === "1" ? "2" : "1";
    const nextPlayer = this._getNextPlayer(newTeamId);
    if (nextPlayer) {
      await this.store.setNewPlayer({ newTeamId, newPlayerId: nextPlayer.id });
    }
  };

  _getNextPlayer = (newTeamId: TeamId): User => {
    const { teams, users } = ReduxStore.getState().game;
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

  _getNextWord = (
    roundWordsLeft: Array<WordId>,
    gameWords: Array<Word>
  ): Word => {
    if (roundWordsLeft.length > 0) {
      const nextWordId =
        roundWordsLeft[Math.floor(Math.random() * roundWordsLeft.length)];
      return gameWords.find((w) => w.id === nextWordId);
    } else return null;
  };

  _handleEndOfRound = async () => {
    const { rounds, currentRound } = ReduxStore.getState().game;
    const round = rounds.find((r) => r.id === currentRound);
    if (round) {
      const currentRoundIndex = round.index;
      if (currentRoundIndex === NUMBER_OF_ROUNDS) {
        await this._end();
      } else {
        const remainingTimeForNextRound = ReduxStore.getState().computer.timer;
        remainingTimeForNextRound.seconds -= 1;
        const nextRound = rounds.find((r) => r.index === currentRoundIndex + 1);
        await this.store.startRound({
          remainingTimeForNextRound,
          nextRoundId: nextRound.id,
        });
      }
    }
  };

  _end = async () => {
    const { rounds } = ReduxStore.getState().game;
    const winningTeamId = getGameWinner(rounds);
    CookiesService.clearCookies();
    if (this.countdown) {
      this.countdown.reset();
    }
    await this.store.gameRef.update({
      stage: "ENDED",
      currentRound: "5",
      winner: winningTeamId,
    });
  };
}

export default Game;
