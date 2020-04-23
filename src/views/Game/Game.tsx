import React from "react";
import Slider from "./Slider";
import RoundInstructions from "./RoundInstructions";
import EndGame from "./EndGame";
import CurrentPlayerVideo from "./CurrentPlayerVideo";

const Game: React.FC = () => {
  return (
    <>
      <Slider />
      <RoundInstructions />
      <EndGame />
      <CurrentPlayerVideo />
    </>
  );
};

export default Game;
