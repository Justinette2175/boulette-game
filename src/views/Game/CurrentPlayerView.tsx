import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { markWordAsFound, startMiming } from "../../redux/game";
import { Store } from "../../types";

import CurrentPlayerViewInterface from "./CurrentPlayerViewInterface";

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const currentWord = useSelector((state: Store) => state.game.currentWord);

  const handleStart = () => {
    dispatch(startMiming());
  };

  const handleFound = () => {
    dispatch(markWordAsFound(currentWord));
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
