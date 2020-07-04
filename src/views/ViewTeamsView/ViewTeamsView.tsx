import React, { useContext } from "react";
import { Box, Button, Typography, Grid } from "@material-ui/core";
import { ArrowRight } from "react-feather";
import { useOwnerIsOnDevice, useGameRef } from "../../hooks";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";
import TeamsContext from "../../contexts/TeamsContext";
import Team from "./Team";

import COPY from "../../copy";

const ViewTeamsView: React.FC = () => {
  const teams = useContext(TeamsContext);
  const ownerIsOnDevice = useOwnerIsOnDevice();
  const gameRef = useGameRef();
  const language = "EN";

  const bothTeamsHaveName = teams && !!teams[0]?.name && !!teams[1]?.name;

  const handleStartGame = () => {
    try {
      gameRef.update({ stage: "PLAYING" });
    } catch (e) {
      //
    }
  };

  return (
    <>
      <RemoteCallsStrip />
      <Box pt={8} px={4}>
        <Typography variant="h1">{COPY.TEAMS_VIEW_TITLE[language]}</Typography>
        <Grid container spacing={2}>
          {teams.map((t) => (
            <Grid item xs={6}>
              <Team team={t} />
            </Grid>
          ))}
        </Grid>
        <Box my={4}>
          {ownerIsOnDevice && (
            <Box>
              <Button
                onClick={handleStartGame}
                color="primary"
                variant="contained"
                endIcon={<ArrowRight />}
                disabled={!bothTeamsHaveName}
              >
                {COPY.TEAMS_VIEW_NEXT_BUTTON[language]}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ViewTeamsView;
