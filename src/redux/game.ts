import { createReducer, createAction } from "redux-act";
import "firebase/firestore";
import { Game, Username, TeamId, Team } from "../types";
import CookiesService from "../services/cookies";
import { resetComputer } from "./computer";

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
  stage: null,
  winner: null,
  wordsPerPlayer: null,
  secondsPerTurn: null,
};

export const resetGame = () => {
  return (dispatch: any) => {
    CookiesService.clearCookies();
    dispatch(resetComputer());
    dispatch(updateGame(initialState));
  };
};

const game = createReducer<Game>({}, initialState);

game.on(updateGame, (state, payload) => ({ ...state, ...payload }));

game.on(updateGameSubcollection, (state, payload) => ({
  ...state,
  [payload.key]: payload.values,
}));

export default game;
