import { createReducer, createAction } from "redux-act";
import firebase from "firebase";
import "firebase/firestore";
import { Game, GameId, Username, TeamId, Store, User, Word } from "../types";
import Firebase from "../services/firebase";
import { NUMBER_OF_ROUNDS } from "../constants";

import { addUserToComputer } from "./computer";

export const updateGame = createAction<Game>("UPDATE_GAME");
export const updateUserTeam = createAction<{
  username: Username;
  teamId: TeamId;
}>();

const getNewGameInfo = (ownerName: Username): Game => {
  const owner = { name: ownerName };
  return {
    owner: ownerName,
    teams: [
      {
        name: "The Birds",
        id: "1",
      },
      {
        name: "The Bees",
        id: "2",
      },
    ],
    users: [owner],
  };
};

const addUserAndListen = (gameId: GameId, userName: Username) => {
  return async (dispatch: any) => {
    dispatch(updateGame({ id: gameId }));
    dispatch(addUserToComputer(userName));
    Firebase.listenToDocument("games", gameId, (g) => {
      dispatch(updateGame(g.data()));
    });
  };
};

export const createGame = function (ownerName: Username) {
  return async (dispatch: any, getState: () => Store) => {
    const initialGameId = getState().game.id;
    if (!initialGameId) {
      const data = getNewGameInfo(ownerName);
      const gameId: GameId = await Firebase.create("games", data);
      if (gameId) {
        dispatch(addUserAndListen(gameId, ownerName));
      }
    }
  };
};

export const joinGame = function (name: Username, gameId: GameId) {
  return async (dispatch: any) => {
    const game = await Firebase.get("games", gameId);
    if (!!game) {
      const newUser: User = {
        name,
      };
      await Firebase.updateData("games", gameId, {
        users: firebase.firestore.FieldValue.arrayUnion(newUser),
      });
      dispatch(addUserAndListen(gameId, name));
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
      await Firebase.updateData("games", gameId, {
        users: firebase.firestore.FieldValue.arrayUnion(newUser),
      });
      dispatch(addUserToComputer(name));
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

export const assignUserToTeam = function (u: User, teamId: TeamId) {
  return async (dispatch: any, getState: () => Store) => {
    const gameId = getState().game.id;
    dispatch(updateUserTeam({ username: u.name, teamId: teamId }));
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

game.on(updateUserTeam, (state, payload) => {
  const indexOfUser = state.users.findIndex((u) => u.name === payload.username);
  const newUser = state.users[indexOfUser];
  newUser.teamId = payload.teamId;
  let newUsers = state.users;
  newUsers.splice(indexOfUser, 1, newUser);
  return { ...state, users: newUsers };
});

export default game;
