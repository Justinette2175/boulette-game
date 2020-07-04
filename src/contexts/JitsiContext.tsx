import React, { createContext } from "react";
import Jitsy from "../services/jitsy";
import { MutedState, JitsiTracks } from "../types/firebaseTypes";

const JitsiContext = createContext<
  [Jitsy, JitsiTracks, string, MutedState, any]
>(null);

export default JitsiContext;
