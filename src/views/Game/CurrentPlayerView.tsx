import React from "react";
import { useSelector } from "react-redux";
import { Store } from "../../types";
import GameService from "../../services/game";
import CurrentPlayerViewInterface from "./CurrentPlayerViewInterface";

const Game: React.FC = () => {
  const currentWord = useSelector((state: Store) => state.game.currentWord);

  const handleStart = () => {
    GameService.startMiming();
  };

  const handleFound = () => {
    GameService.handleFoundWord(currentWord);
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
