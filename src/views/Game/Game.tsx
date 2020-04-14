import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import { Store, Team, Round } from "../../types";
import Slider from "./Slider";

import ScoreBoard from "./ScoreBoard";

const Game: React.FC = () => {
  return (
    <Box>
      <Slider />
      <ScoreBoard />
    </Box>
  );
};

export default Game;
