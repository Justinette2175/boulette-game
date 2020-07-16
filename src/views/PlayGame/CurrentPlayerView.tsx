import React, { useContext } from "react";

import CurrentPlayerViewInterface from "./CurrentPlayerViewInterface";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import useHandleWordFound from "../../hooks/useHandleWordFound";
import useHandleStartTurn from "../../hooks/useHandleStartTurn";

const Game: React.FC = () => {
  const round = useContext(CurrentRoundContext);
  const currentWord = round ? round.currentWord : null;
  const handleWordFound = useHandleWordFound();
  const handleStartTurn = useHandleStartTurn();

  const handleStart = () => {
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
