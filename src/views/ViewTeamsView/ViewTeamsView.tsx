import React from "react";
import { useSelector } from "react-redux";
import { Store } from "../../types";
import { Box, Button, Typography, Grid, useTheme } from "@material-ui/core";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";
import { ArrowRight } from "react-feather";
import GameService from "../../services/game";
import ContentWrapper from "../../components/ContentWrapper";

import COPY from "../../copy";

const ViewTeamsView: React.FC = () => {
  const teams = useSelector((state: Store) => state.game.teams);
  const users = useSelector((state: Store) => state.game.users);
  const gameOwner = useSelector((state: Store) => state.game.owner);
  const computerUserIds = useSelector((state: Store) => state.computer.users);
  const ownerIsOnComputer = computerUserIds.indexOf(gameOwner) > -1;
  const language = useSelector((state: Store) => state.computer.language);

  const theme = useTheme();

  const handleStartGame = () => {
    GameService.startGame();
  };

  const teamsMarkup = teams.map((t) => {
    const teamUsers = users.filter((user) => user.teamId === t.id);
    return (
      <Box>
        <Typography variant="h2" gutterBottom>
          {t.name}
        </Typography>
        <Grid container spacing={4}>
          {teamUsers.map((u) => (
            <Grid item>
              <PlayerAndAvatar name={u.name} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  });

  return (
    <>
      <ContentWrapper
        leftChild={
          <>
            <Box height="100px">
              <Typography variant="h1">
                {COPY.TEAMS_VIEW_TITLE[language]}
              </Typography>
            </Box>
            {teamsMarkup[0]}
          </>
        }
        rightChild={
          <>
            <Box height="100px" />
            {teamsMarkup[1]}
            <Box display="flex" flexDirection="column" my={4}>
              <Box mb={2} maxWidth="300px">
                <Typography variant="h4">
                  {ownerIsOnComputer
                    ? COPY.TEAMS_VIEW_WAIT[language]
                    : COPY.TEAMS_VIEW_NEXT_INSTRUCTIONS[language]}
                </Typography>
              </Box>
              {ownerIsOnComputer && (
                <Box>
                  <Button
                    onClick={handleStartGame}
                    color="primary"
                    variant="contained"
                    endIcon={<ArrowRight />}
                  >
                    {COPY.TEAMS_VIEW_NEXT_BUTTON[language]}
                  </Button>
                </Box>
              )}
            </Box>
          </>
        }
      />
    </>
  );
};

export default ViewTeamsView;
