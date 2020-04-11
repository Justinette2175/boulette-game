import React from "react";
import JoinGame from "./JoinGame";
import StartGame from "./StartGame";
import { Box } from "@material-ui/core";

const StartOrJoinGame: React.FC = () => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Box width="500px" mr={2} p={2}>
        <JoinGame />
      </Box>
      <Box width="500px" ml={2} p={2}>
        <StartGame />
      </Box>
    </Box>
  );
};

export default StartOrJoinGame;
