import { GameId, UserId, TeamId, Word, Round, Time } from "../../types";
import Firebase from "./firebase";
import firebase from "firebase";

const db = Firebase.db;
class FirebaseGameInterface {
  gameId: GameId;
  gameRef: any;
  teamsRef: any;
  usersRef: any;
  roundsRef: any;
  wordsRef: any;
  db: any;

  constructor(gameId: GameId) {
    this.gameId = gameId;
    this.gameRef = db.collection("games").doc(gameId);
    this.teamsRef = this.gameRef.collection("teams");
    this.usersRef = this.gameRef.collection("users");
    this.roundsRef = this.gameRef.collection("rounds");
    this.wordsRef = this.gameRef.collection("words");
    this.db = db;
  }

  listenToGame = (cb: (c: any) => any) => {
    this.gameRef.onSnapshot((c: any) => cb(c));
  };

  listenToTeams = (cb: (c: any) => any) => {
    this.teamsRef.onSnapshot((c: any) => cb(c));
  };

  listenToUsers = (cb: (c: any) => any) => {
    this.usersRef.onSnapshot((c: any) => cb(c));
  };

  listenToWords = (cb: (c: any) => any) => {
    this.wordsRef.onSnapshot((c: any) => cb(c));
  };

  listenToRounds = (cb: (c: any) => any) => {
    this.roundsRef.onSnapshot((c: any) => cb(c));
  };

  createOwnerUser = async (
    { ownerName }: { ownerName: string },
    batch?: any
  ) => {
    const ownerUserRef = this.usersRef.doc();
    const localBatch = batch || this.db.batch();
    localBatch.set(this.gameRef, { owner: ownerUserRef.id });
    localBatch.set(ownerUserRef, {
      name: ownerName,
      createdAt: Date.now(),
      teamId: "1",
    });
    if (batch) {
      return [ownerUserRef.id, localBatch];
    } else {
      await localBatch.commit();
      return ownerUserRef.id;
    }
  };

  setNewPlayer = async (
    {
      newTeamId,
      newPlayerId,
    }: {
      newTeamId: TeamId;
      newPlayerId: UserId;
    },
    batch?: any
  ) => {
    const localBatch = batch || this.db.batch();
    localBatch.update(this.gameRef, {
      currentTeam: newTeamId,
      currentUser: newPlayerId,
    });
    localBatch.update(this.teamsRef.doc(newTeamId), {
      lastPlayerId: newPlayerId,
    });
    if (batch) {
      return localBatch;
    } else {
      await localBatch.commit();
    }
  };

  initializeRounds = ({ rounds }: { rounds: Array<Round> }, batch?: any) => {
    const localBatch = batch || this.db.batch();
    let firstRoundIndex;
    rounds.forEach((r) => {
      const roundRef = this.roundsRef.doc();
      if (r.index === 1) {
        firstRoundIndex = roundRef.id;
      }
      localBatch.set(roundRef, r);
    });
    if (batch) {
      return [localBatch, firstRoundIndex];
    }
    batch.commit();
    return firstRoundIndex;
  };

  startTurn = async ({
    word,
    endOfCurrentTurn,
  }: {
    word: Word;
    endOfCurrentTurn: Time;
  }) => {
    await this.gameRef.update({
      currentWord: word,
      endOfCurrentTurn,
      remainingTimeForNextRound: null,
    });
  };

  logWordGuessed = async (
    {
      roundId,
      guessedWord,
      nextWord,
      currentTeam,
      newScore,
    }: {
      roundId: string;
      guessedWord: Word;
      nextWord: Word;
      currentTeam: TeamId;
      newScore: number;
    },
    batch?: any
  ) => {
    const localBatch = batch || this.db.batch();
    localBatch.update(this.roundsRef.doc(roundId), {
      wordsLeft: firebase.firestore.FieldValue.arrayRemove(guessedWord.id),
      wordsGuessed: firebase.firestore.FieldValue.arrayUnion(guessedWord.id),
      [`score.${currentTeam}`]: newScore,
    });

    localBatch.update(this.gameRef, { currentWord: nextWord });
    if (batch) {
      return localBatch;
    }
    await localBatch.commit();
  };

  startRound = async ({
    nextRoundId,
    remainingTimeForNextRound = null,
  }: {
    nextRoundId: string;
    remainingTimeForNextRound: Time;
  }) => {
    const data: any = {
      currentRound: nextRoundId,
      remainingTimeForNextRound: remainingTimeForNextRound,
      endOfCurrentTurn: null,
    };
    await this.gameRef.update(data);
  };
}

export default FirebaseGameInterface;
