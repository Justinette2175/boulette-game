import React, { useContext } from "react";
import { FirebaseContext } from "../firebase";
import GameContext from "../contexts/GameContext";

const useGameRef = (): any => {
  const game = useContext(GameContext);
  const firebase = useContext(FirebaseContext);
  if (game && game.id) {
    return firebase.firestore.collection("games").doc(game.id);
  } else return null;
};

export default useGameRef;
