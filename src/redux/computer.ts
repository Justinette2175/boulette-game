import { createReducer, createAction } from "redux-act";
import moment from "moment";
import { ComputerReducer, Time, UserId } from "../types";
import { SECOND_DURATION_OF_TURN } from "../constants";
import Cookies from "js-cookie";

export const addUserToComputer = createAction<UserId>("ADD_USER_TO_COMPUTER");
export const updateTimer = createAction<Time>("UPDATE_TIMER");
export const updateInstructionsVisibility = createAction<boolean>(
  "UPDATE_INSTRUCTIONS_VISIBILITY"
);
export const resetTimer = createAction("RESET_TIMER");
export const updateId = createAction<string>("UPDATE_ID");

export const resetComputer = createAction("RESET_COMPUTER");

const makeTimerObjectFromSeconds = (seconds: number): Time => {
  const duration = moment.duration(seconds, "seconds");
  return {
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  };
};

export const regularTimer = makeTimerObjectFromSeconds(SECOND_DURATION_OF_TURN);

const initialState: ComputerReducer = {
  users: [],
  timer: regularTimer,
  instructionsVisible: false,
  jitsyId: null,
};

const computer = createReducer<ComputerReducer>({}, initialState);

export const addUserToComputerAndSetCookie = function (userId: UserId) {
  return (dispatch: any) => {
    const users: Array<string> = Cookies.getJSON("users") || [];
    if (users.indexOf(userId) < 0) {
      users.push(userId);
    }
    Cookies.set("users", users, { expires: 1 });
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

computer.on(resetTimer, (state) => ({
  ...state,
  timer: regularTimer,
}));

computer.on(updateInstructionsVisibility, (state, payload) => {
  return { ...state, instructionsVisible: payload };
});

computer.on(updateId, (state, payload) => {
  return { ...state, jitsyId: payload };
});

computer.on(resetComputer, () => initialState);

export default computer;
