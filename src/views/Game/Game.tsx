import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import { Store, Team, Round } from "../../types";
import Slider from "./Slider";

const Game: React.FC = () => {
  return (
    <Box>
      <Slider />
    </Box>
  );
};

export default Game;
