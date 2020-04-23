import React from "react";
import Slider from "./Slider";
import RoundInstructions from "./RoundInstructions";
import EndGame from "./EndGame";

const Game: React.FC = () => {
  return (
    <>
      <Slider />
      <RoundInstructions />
      <EndGame />
    </>
  );
};

export default Game;
