import React from "react";
import Slider from "./Slider";
import RoundInstructions from "./RoundInstructions";
import CurrentPlayerVideo from "./CurrentPlayerVideo";

const Game: React.FC = () => {
  return (
    <>
      <Slider />
      <RoundInstructions />
      {/* <CurrentPlayerVideo /> */}
    </>
  );
};

export default Game;
