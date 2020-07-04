import React from "react";
import { FirebaseGameTeam } from "../types/firebaseTypes";

const TeamsContext = React.createContext<Array<FirebaseGameTeam>>(null);

export default TeamsContext;
