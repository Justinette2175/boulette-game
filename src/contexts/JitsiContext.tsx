import React, { createContext } from "react";
import Jitsy from "../services/jitsy";
import { MutedState, VideoTracks } from "../types/firebaseTypes";

const JitsiContext = createContext<
  [Jitsy, VideoTracks, string, MutedState, any]
>(null);

export default JitsiContext;
