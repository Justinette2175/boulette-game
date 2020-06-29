import React, { useContext, useState } from "react";

import CurrentPlayerViewInterface from "./CurrentPlayerViewInterface";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import useHandleWordFound from "../../hooks/useHandleWordFound";
import useHandleStartTurn from "../../hooks/useHandleStartTurn";

import { FirebaseGameWord } from "../../types/firebaseTypes";

const Game: React.FC = () => {
  const round = useContext(CurrentRoundContext);
  const currentWord = round ? round.currentWord : null;
  const handleWordFound = useHandleWordFound();
  const handleStartTurn = useHandleStartTurn();
  const [wordsLeft, setWordsLeft] = useState<{
    [key: string]: FirebaseGameWord;
  }>({});

  const handleStart = () => {
    setWordsLeft(round.wordsLeft);
    handleStartTurn();
  };

  const handleFound = (wordId: string) => {
    handleWordFound(wordId);
  };

  return (
    <CurrentPlayerViewInterface
      onStart={handleStart}
      onFound={handleFound}
      currentWord={currentWord}
    />
  );
};

export default Game;
