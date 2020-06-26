import React from "react";
import { FirebaseGame } from "../types/firebaseTypes";

const GameContext = React.createContext<FirebaseGame>(null);

export default GameContext;
