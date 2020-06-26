import React, { useContext } from "react";
import { Store } from "../../types";
import { Box, Button, Typography, Grid, useTheme } from "@material-ui/core";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";
import { ArrowRight } from "react-feather";
import ContentWrapper from "../../components/ContentWrapper";
// import RemoteCallsStrip from "../../components/RemoteCallsStrip";
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
      <Box>
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
      </Box>
    );
  });

  return (
    <>
      <ContentWrapper
        maxWidth={600}
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
                  {ownerIsOnDevice
                    ? COPY.TEAMS_VIEW_WAIT[language]
                    : COPY.TEAMS_VIEW_NEXT_INSTRUCTIONS[language]}
                </Typography>
              </Box>
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
          </>
        }
      />
      {/* <Box position="fixed" style={{ left: 0, bottom: 0, right: 0 }}>
        <RemoteCallsStrip includeLocal includeNames={false} />
      </Box> */}
    </>
  );
};

export default ViewTeamsView;
