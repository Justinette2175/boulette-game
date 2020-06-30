import React, { useContext } from "react";
import { Box, Button, Typography, Grid } from "@material-ui/core";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";
import { ArrowRight } from "react-feather";
import { useGameTeams, useOwnerIsOnDevice, useGameRef } from "../../hooks";

import COPY from "../../copy";

const ViewTeamsView: React.FC = () => {
  const teams = useGameTeams();
  const ownerIsOnDevice = useOwnerIsOnDevice();
  const gameRef = useGameRef();
  const language = "EN";

  const handleStartGame = () => {
    try {
      gameRef.update({ stage: "PLAYING" });
    } catch (e) {
      //
    }
  };

  const teamsMarkup = teams.map((t) => {
    const teamPlayers = t.players || {};
    return (
      <Grid item xs={6}>
        <Typography variant="h2" gutterBottom>
          {t.name}
        </Typography>
        <Grid container spacing={4}>
          {Object.values(teamPlayers).map((player) => (
            <Grid item key={player.id}>
              <PlayerAndAvatar name={player.name} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  });

  return (
    <Box pt={4}>
      <Typography variant="h1">{COPY.TEAMS_VIEW_TITLE[language]}</Typography>
      <Grid container spacing={2}>
        {teamsMarkup[0]}
        {teamsMarkup[1]}
      </Grid>
      <Box my={4}>
        {ownerIsOnDevice && (
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
    </Box>
  );
};

export default ViewTeamsView;
