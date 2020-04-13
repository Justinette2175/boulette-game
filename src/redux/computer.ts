import { createReducer, createAction } from "redux-act";
import { ComputerReducer, Username } from "../types";

export const addUserToComputer = createAction<Username>("ADD_USER_TO_COMPUTER");
export const updateTimer = createAction<number>("UPDATE_TIMER");

const initialState: ComputerReducer = {
  users: [],
  timer: null,
};

const computer = createReducer<ComputerReducer>({}, initialState);

computer.on(addUserToComputer, (state, payload) => ({
  ...state,
  users: [...state.users, payload],
}));

computer.on(updateTimer, (state, payload) => {
  return { ...state, timer: payload };
});

export default computer;
