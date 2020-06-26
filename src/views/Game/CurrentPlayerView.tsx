import React, { useContext } from "react";
import GameContext from "../../contexts/GameContext";

import CurrentPlayerViewInterface from "./CurrentPlayerViewInterface";

const Game: React.FC = () => {
  const game = useContext(GameContext);
  const currentWord = game.currentWord;

  const handleStart = () => {
    //
  };

  const handleFound = () => {
    //
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
