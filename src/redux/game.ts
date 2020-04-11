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
  Word,
  Team,
  UserId,
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
export const updateUsers = createAction<Array<User>>("UPDATE_USERS");
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
    dispatch(updateUsers(users));
  });
  gameRef.collection("teams").onSnapshot(function (c: any) {
    const teams: Array<Team> = [];
    c.forEach((t: any) => teams.push({ id: t.id, ...t.data() }));
    dispatch(updateTeams(teams));
  });
};

export const createGame = function (ownerName: Username) {
  return async (dispatch: any, getState: () => Store) => {
    const initialGameId = getState().game.id;
    const owner = { name: ownerName };
    if (!initialGameId) {
      let batch = db.batch();
      const newGameRef = db.collection("games").doc();
      const ownerUserRef = newGameRef.collection("users").doc();
      batch.set(newGameRef, { owner: ownerUserRef.id });
      batch.set(ownerUserRef, owner);
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
        await transaction.set(newUserRef, { name });
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

export const startGame = function () {
  return async (dispatch: any, getState: () => Store) => {
    const gameId = getState().game.id;
    dispatch(updateGame({ currentRound: 1 }));
    await Firebase.updateData("games", gameId, {
      currentRound: 1,
    });
  };
};

export const assignUserToTeam = function (userId: UserId, teamId: TeamId) {
  return async (dispatch: any, getState: () => Store) => {
    const gameId = getState().game.id;
    const gameRef = db.collection("games").doc(gameId);
    await gameRef.collection("users").doc(userId).update({ teamId });
    console.log("I updated user");
  };
};

const makeRounds = () =>
  Array.apply(null, Array(NUMBER_OF_ROUNDS)).map((_, i) => ({
    index: i + 1,
    score: [],
    wordsLeft: [],
    wordsGuessed: [],
  }));

const initialState: Game = {
  id: null,
  owner: null,
  rounds: makeRounds(),
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

game.on(updateUsers, (state, payload) => ({ ...state, users: payload }));

game.on(updateTeams, (state, payload) => ({ ...state, teams: payload }));

export default game;
