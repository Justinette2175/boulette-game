import { createReducer, createAction } from "redux-act";
import moment from "moment";
import { ComputerReducer, Time, UserId, Store } from "../types";
import Cookies from "js-cookie";
import ReduxStore from "../redux/store";

export const addUserToComputer = createAction<UserId>("ADD_USER_TO_COMPUTER");
export const setTimer = createAction<Time>("UPDATE_TIMER");
export const updateInstructionsVisibility = createAction<boolean>(
  "UPDATE_INSTRUCTIONS_VISIBILITY"
);
export const updateId = createAction<string>("UPDATE_ID");

export const resetComputer = createAction("RESET_COMPUTER");

export const setAudioMuted = createAction<boolean>("SET_AUDIO_MUTED");
export const setVideoMuted = createAction<boolean>("SET_VIDEO_MUTED");

export const updateLanguage = createAction<"FR" | "EN">("UPDATE_LANGUAGE");

const makeTimerObjectFromSeconds = (seconds: number): Time => {
  const duration = moment.duration(seconds, "seconds");
  return {
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  };
};

const initialState: ComputerReducer = {
  users: [],
  timer: null,
  instructionsVisible: false,
  jitsyId: null,
  language: "EN",
  audioMuted: false,
  videoMuted: false,
};

const computer = createReducer<ComputerReducer>({}, initialState);

export const updateTimer = (time: Time): any => {
  return (dispatch: any) => {
    dispatch(setTimer({ minutes: time.minutes, seconds: time.seconds + 1 }));
  };
};

export const resetTimer = (): any => {
  return (dispatch: any, getState: () => Store) => {
    const {
      game: { secondsPerTurn },
    } = getState();

    if (secondsPerTurn) {
      const timer = makeTimerObjectFromSeconds(secondsPerTurn);
      dispatch(setTimer(timer));
    }
  };
};

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

computer.on(setTimer, (state, payload) => {
  return { ...state, timer: payload };
});

computer.on(updateInstructionsVisibility, (state, payload) => {
  return { ...state, instructionsVisible: payload };
});

computer.on(updateId, (state, payload) => {
  return { ...state, jitsyId: payload };
});

computer.on(setAudioMuted, (state, payload) => {
  return { ...state, audioMuted: payload };
});

computer.on(setVideoMuted, (state, payload) => {
  return { ...state, videoMuted: payload };
});

computer.on(resetComputer, () => initialState);

computer.on(updateLanguage, (state, payload) => {
  return { ...state, language: payload };
});

export default computer;
