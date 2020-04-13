import React from "react";
import JoinGame from "./JoinGame";
import StartGame from "./StartGame";
import { Box, Paper } from "@material-ui/core";

const StartOrJoinGame: React.FC = () => {
  return (
    <Box
      display="flex"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Box width="500px" mr={4}>
        <Paper elevation={0}>
          <JoinGame />
        </Paper>
      </Box>
      <Box width="500px" ml={4}>
        <Paper elevation={0}>
          <StartGame />
        </Paper>
      </Box>
    </Box>
  );
};

export default StartOrJoinGame;
