import React from "react";
import { FirebaseGameRound } from "../types/firebaseTypes";

const CurrentRoundContext = React.createContext<FirebaseGameRound>(null);

export default CurrentRoundContext;
