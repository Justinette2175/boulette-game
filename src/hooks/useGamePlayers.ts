import React, { useState, useEffect } from "react";
import { FirebasePlayer } from "../types/firebaseTypes";
import useGameRef from "./useGameRef";

const useGamePlayers = (): Array<FirebasePlayer> => {
  const gameRef = useGameRef();
  const [players, setPlayers] = useState<Array<FirebasePlayer>>([]);

  const listenToGamePlayers = () => {
    if (gameRef) {
      return gameRef.collection("players").onSnapshot((snap: any) => {
        const gamePlayers: Array<FirebasePlayer> = [];
        snap.forEach((player: any) => {
          gamePlayers.push({ ...player.data(), id: player.id });
        });
        setPlayers(gamePlayers);
      });
    }
  };

  useEffect(() => {
    const unsubscribe = listenToGamePlayers();
    return unsubscribe;
  }, []);

  return players;
};

export default useGamePlayers;
