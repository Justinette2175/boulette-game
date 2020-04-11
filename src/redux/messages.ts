import { createAction, createReducer } from "redux-act";
import { Message, MessageReducer } from "../types";
import Firebase from "../services/firebase";

export const updateMessages = createAction<Array<Message>>("UPDATE_MESSAGES");

export const listenForMessageUpdate = () => {
  return async (dispatch: any) => {
    Firebase.listenToCollection("messages", (messages: Array<Message>) => {
      dispatch(updateMessages(messages));
    });
  };
};

const initialState: MessageReducer = {
  all: [],
  loading: false,
};

const messages = createReducer<MessageReducer>({}, initialState);

messages.on(updateMessages, (state, payload) => ({
  ...state,
  all: payload,
  loading: false,
}));

export default messages;
