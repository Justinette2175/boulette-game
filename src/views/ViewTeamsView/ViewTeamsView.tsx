import React, { useContext } from "react";
import { Box, Button, Typography, Grid } from "@material-ui/core";
import { useOwnerIsOnDevice, useGameRef } from "../../hooks";
import TeamsContext from "../../contexts/TeamsContext";
import Team from "./Team";
import { H1 } from "../../components/Typography";

import COPY from "../../copy";

import viewTeams from "../../assets/images/view-teams.png";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { NextButton } from "../../components/Buttons";
import SetTeamName from "./SetTeamName";
import { ViewWrapper, LighterBox } from "../../components/Containers";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    leftBox: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
        marginRight: theme.spacing(2),
      },
    },
    h1: {
      [theme.breakpoints.down("xs")]: {
        maxWidth: "300px",
      },
    },
    instructions: {
      marginBottom: theme.spacing(3),
      [theme.breakpoints.down("xs")]: {
        maxWidth: "200px",
        marginBottom: theme.spacing(6),
      },
    },
    rightBox: {
      flex: 0,

      [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
        flex: 3,
      },
    },
    imageWrapper: {
      [theme.breakpoints.down("xs")]: {
        position: "absolute",
        top: "48px",
        left: "58%",
        width: "160px",
      },
    },
  });
});

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

  const classes = useStyles();

  return (
    <ViewWrapper>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        position="relative"
      >
        <Box flex={4} className={classes.leftBox}>
          <H1 className={classes.h1}>{COPY.TEAMS_VIEW_TITLE[language]}</H1>
          <Typography className={classes.instructions}>
            Le capitaine de chaque équipe doit entrer un nom pour son équipe.
          </Typography>
          {/* Teams */}
          <LighterBox>
            <Grid container spacing={4}>
              {teams.map((t) => (
                <Grid item xs={6}>
                  <Team team={t} />
                </Grid>
              ))}
            </Grid>
          </LighterBox>
          <Box>
            {teams.map((t) => (
              <Box mt={3}>
                <SetTeamName team={t} />
              </Box>
            ))}
          </Box>
          {ownerIsOnDevice && (
            <NextButton>
              <Button
                onClick={handleStartGame}
                color="primary"
                variant="contained"
                disabled={!bothTeamsHaveName}
              >
                {COPY.TEAMS_VIEW_NEXT_BUTTON[language]}
              </Button>
            </NextButton>
          )}
        </Box>

        <Box className={classes.rightBox}>
          <Box
            display="flex"
            justifyContent="center"
            className={classes.imageWrapper}
          >
            <Box maxWidth="350px">
              <img
                width="100%"
                src={viewTeams}
                alt="Cartoon character's faces on either side of a lightning bolt."
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </ViewWrapper>
  );
};

export default ViewTeamsView;
