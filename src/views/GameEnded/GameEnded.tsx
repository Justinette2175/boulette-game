import React, { useContext, useState, useEffect } from "react";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";
import { Link } from "react-router-dom";

import { Box, Typography, Button, Grid } from "@material-ui/core";

import COPY from "../../copy";
import GameContext from "../../contexts/GameContext";
import TeamsContext from "../../contexts/TeamsContext";
import { useGameRef } from "../../hooks";
import { FirebaseGameRound } from "../../types/firebaseTypes";

const getWinningTeamId = (score: { [teamId: string]: number }): string => {
  let winningTeam = null;
  try {
    if (score["1"] - score["2"] < 0) {
      winningTeam = "2";
    } else if (score["1"] - score["2"] > 0) {
      winningTeam = "1";
    }
  } catch (e) {
    console.log("Error:GameEnded");
  }
  return winningTeam;
};

const GameEnded: React.FC = () => {
  const game = useContext(GameContext);
  const gameRef = useGameRef();
  const teams = useContext(TeamsContext);
  const score = game.score;
  const winningTeamId = getWinningTeamId(score);
  const winningTeam = teams.find((t) => t.id === winningTeamId);
  const winningTeamName = winningTeam
    ? winningTeam.name || winningTeam.id
    : null;
  const language = "EN";
  const [rounds, setRounds] = useState<Array<FirebaseGameRound>>([]);

  const getRoundslistScores = async () => {
    const snapshots = await gameRef.collection("rounds").get();
    const newRounds: Array<FirebaseGameRound> = [];
    snapshots.forEach((snap: any) => {
      newRounds.push({ ...snap.data(), id: snap.id });
    });
    setRounds(newRounds);
  };

  useEffect(() => {
    getRoundslistScores();
  }, []);

  return (
    <>
      <RemoteCallsStrip />
      <Box pt={8} px={4}>
        <Typography variant="h2">
          {winningTeamName &&
            `${COPY.WINNING_TEAM_1[language]} ${winningTeamName} ${COPY.WINNING_TEAM_2[language]}`}
          {winningTeamId && !winningTeamName && COPY.GAME_END_DRAW[language]}
        </Typography>
        <Box my={2} maxWidth="400px">
          <Grid container spacing={1} justify="center" alignItems="center">
            <Grid item xs={4}></Grid>
            {teams.map((t) => (
              <Grid item xs={4} key={t.id}>
                <Typography align="center">
                  {t.name || `Team ${t.id}`}
                </Typography>
              </Grid>
            ))}
            {rounds.map((r, i) => (
              <>
                <Grid item xs={4}>
                  <Typography>Round {r.id}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography align="center">{r.score["1"]}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography align="center">{r.score["2"]}</Typography>
                </Grid>
              </>
            ))}
          </Grid>
        </Box>
        <Typography variant="body1">
          {COPY.END_GAME_THANKS[language]}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" component={Link} to="/">
            {COPY.PLAY_OTHER_GAME_BUTTON[language]}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default GameEnded;
