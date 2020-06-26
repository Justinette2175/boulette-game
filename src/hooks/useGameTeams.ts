import React, { useState, useEffect } from "react";
import { FirebaseGameTeam } from "../types/firebaseTypes";
import useGameRef from "./useGameRef";

const useGameTeams = (): Array<FirebaseGameTeam> => {
  const gameRef = useGameRef();
  const [teams, setTeams] = useState<Array<FirebaseGameTeam>>([]);

  const listenToGameTeams = () => {
    return gameRef.collection("teams").onSnapshot((snap: any) => {
      const gameTeams: Array<FirebaseGameTeam> = [];
      snap.forEach((team: any) => {
        console.log("team is", team);
        gameTeams.push({ ...team.data(), id: team.id });
      });
      setTeams(gameTeams);
    });
  };

  useEffect(() => {
    const unsubscribe = listenToGameTeams();
    return unsubscribe;
  }, []);

  return teams;
};

export default useGameTeams;
