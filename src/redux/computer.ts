import { createReducer, createAction } from "redux-act";
import { ComputerReducer, Username } from "../types";

export const addUserToComputer = createAction<Username>("ADD_USER_TO_COMPUTER");

const initialState: ComputerReducer = {
  users: [],
};

const computer = createReducer<ComputerReducer>({}, initialState);

computer.on(addUserToComputer, (state, payload) => ({
  ...state,
  users: [...state.users, payload],
}));

export default computer;
