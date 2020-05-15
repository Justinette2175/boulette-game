import React from "react";
import Slider from "./Slider";
import RoundInstructions from "./RoundInstructions";
import { Box } from "@material-ui/core";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";

const Game: React.FC = () => {
  return (
    <>
      <Slider />
      <RoundInstructions />
      <Box position="fixed" style={{ left: 0, bottom: 0, right: 0 }}>
        <RemoteCallsStrip audioOnly includeNames={false} />
      </Box>
    </>
  );
};

export default Game;
