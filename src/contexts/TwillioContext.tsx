import React, { createContext } from "react";
import Twillio from "../services/twillio";
import { MutedState, VideoTracks } from "../types/firebaseTypes";

const TwillioContext = createContext<[Twillio, VideoTracks, boolean]>(null);

export default TwillioContext;
