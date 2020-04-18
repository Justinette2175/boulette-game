import { createReducer, createAction } from "redux-act";
import { ComputerReducer, Username, Time, UserId } from "../types";
import Cookies from "js-cookie";

export const addUserToComputer = createAction<UserId>("ADD_USER_TO_COMPUTER");
export const updateTimer = createAction<Time>("UPDATE_TIMER");

const initialState: ComputerReducer = {
  users: [],
  timer: null,
};

const computer = createReducer<ComputerReducer>({}, initialState);

export const addUserToComputerAndSetCookie = function (userId: UserId) {
  return (dispatch: any) => {
    const users: Array<string> = Cookies.getJSON("users") || [];
    if (users.indexOf(userId) < 0) {
      users.push(userId);
    }
    Cookies.set("users", users);
    dispatch(addUserToComputer(userId));
  };
};

computer.on(addUserToComputer, (state, payload) => ({
  ...state,
  users: [...state.users, payload],
}));

computer.on(updateTimer, (state, payload) => {
  return { ...state, timer: payload };
});

export default computer;
