import React from "react";
import { useSelector } from "react-redux";

import { Box, Typography, Paper } from "@material-ui/core";
import { Store } from "../../types";

const GameEnded: React.FC = () => {
  const teams = useSelector((state: Store) => state.game.teams);
  const winningTeamId = useSelector((state: Store) => state.game.winner);
  const winningTeam = teams.find((t) => t.id === winningTeamId);
  const winningTeamName = winningTeam ? winningTeam.name : null;

  return (
    <Box
      minHeight="100vh"
      p={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box maxWidth="500px">
        <Paper elevation={0}>
          <Box p={4}>
            <Typography align="center" variant="h3">
              It's the end of this game.
            </Typography>
            <Typography align="center" variant="h1">
              {winningTeamName && `Team ${winningTeamName} wins!`}
              {winningTeamId && !winningTeamName && "It's a draw!"}
            </Typography>
            <Typography align="center" variant="body1">
              Thanks for playing!
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default GameEnded;
