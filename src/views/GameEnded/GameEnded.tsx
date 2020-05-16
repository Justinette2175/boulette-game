import React from "react";
import { useSelector } from "react-redux";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";

import { Box, Typography, Paper, Button } from "@material-ui/core";
import { Store } from "../../types";

import COPY from "../../copy";

const GameEnded: React.FC = () => {
  // const dispatch = useDispatch();
  const teams = useSelector((state: Store) => state.game.teams);
  const winningTeamId = useSelector((state: Store) => state.game.winner);
  const winningTeam = teams.find((t) => t.id === winningTeamId);
  const winningTeamName = winningTeam ? winningTeam.name : null;
  const language = useSelector((state: Store) => state.computer.language);

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <>
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
              <Typography variant="body1">
                {COPY.END_GAME_TITLE[language]}
              </Typography>
              <Typography variant="h2">
                {winningTeamName &&
                  `${COPY.WINNING_TEAM_1[language]} ${winningTeamName} ${COPY.WINNING_TEAM_2[language]}`}
                {winningTeamId &&
                  !winningTeamName &&
                  COPY.GAME_END_DRAW[language]}
              </Typography>
              <Typography variant="body1">
                {COPY.END_GAME_THANKS[language]}
              </Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePlayAgain}
                >
                  {COPY.PLAY_OTHER_GAME_BUTTON[language]}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
      <Box position="fixed" style={{ left: 0, bottom: 0, right: 0 }}>
        <RemoteCallsStrip includeLocal includeNames={false} />
      </Box>
    </>
  );
};

export default GameEnded;
