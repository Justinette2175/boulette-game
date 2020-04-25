import { createReducer, createAction } from "redux-act";
import "firebase/firestore";
import { Game, Username, TeamId, Team } from "../types";

export const updateGame = createAction<Game>("UPDATE_GAME");
export const updateGameSubcollection = createAction<{
  values: Array<any>;
  key: string;
}>("UPDATE_USERS");

export const resetGame = createAction("RESET_GAME");

export const updateTeams = createAction<Array<Team>>("UPDATE_TEAMS");
export const updateUserTeam = createAction<{
  username: Username;
  teamId: TeamId;
}>();

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

game.on(resetGame, () => initialState);

export default game;
