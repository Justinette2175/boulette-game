import { combineReducers } from "redux";
import messages from "./messages";
import game from "./game";
import computer from "./computer";

export default combineReducers({
  messages,
  game,
  computer,
});
