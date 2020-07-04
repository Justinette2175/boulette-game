import React, { useState, useEffect, useContext } from "react";
import { FirebasePlayer } from "../types/firebaseTypes";
import GameContext from "../contexts/GameContext";
import { FirebaseContext } from "../firebase";

const useGamePlayers = (): Array<FirebasePlayer> => {
  const firebase = useContext(FirebaseContext);
  const game = useContext(GameContext);
  const [players, setPlayers] = useState<Array<FirebasePlayer>>([]);

  const listenToGamePlayers = () => {
    if (game) {
      return firebase
        .firestore()
        .collection("games")
        .doc(game.id)
        .collection("players")
        .onSnapshot((snap: any) => {
          const gamePlayers: Array<FirebasePlayer> = [];
          snap.forEach((player: any) => {
            gamePlayers.push({ ...player.data(), id: player.id });
          });
          setPlayers(gamePlayers);
        });
    }
  };

  useEffect(() => {
    if (game?.id) {
      const unsubscribe = listenToGamePlayers();
      return unsubscribe;
    }
  }, [game?.id]);

  return players;
};

export default useGamePlayers;
