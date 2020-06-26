import React, { useState, useEffect } from "react";
import { FirebaseGameWord } from "../types/firebaseTypes";
import useGameRef from "./useGameRef";

const useGameWords = (): Array<FirebaseGameWord> => {
  const gameRef = useGameRef();
  const [words, setWords] = useState<Array<FirebaseGameWord>>([]);

  const listenToGameWords = () => {
    return gameRef.collection("words").onSnapshot((snap: any) => {
      const gamewords: Array<FirebaseGameWord> = [];
      snap.forEach((word: any) => {
        gamewords.push({ ...word.data(), id: word.id });
      });
      setWords(gamewords);
    });
  };

  useEffect(() => {
    const unsubscribe = listenToGameWords();
    return unsubscribe;
  }, []);

  return words;
};

export default useGameWords;
