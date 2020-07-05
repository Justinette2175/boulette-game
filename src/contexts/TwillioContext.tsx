import React, { createContext } from "react";
import Twillio from "../services/twillio";
import { MutedState, JitsiTracks } from "../types/firebaseTypes";

const TwillioContext = createContext<[Twillio, JitsiTracks, boolean]>(null);

export default TwillioContext;
