import React, { useContext } from "react";
import { Box, useTheme, Typography, Grid } from "@material-ui/core";
import CurrentPlayerVideo from "./CurrentPlayerVideo";
import TeamsContext from "../../contexts/TeamsContext";
import GameContext from "../../contexts/GameContext";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import { FirebasePlayer } from "../../types/firebaseTypes";

interface IProps {}

const OtherPlayersView: React.FC<IProps> = () => {
  const round = useContext(CurrentRoundContext);
  const teams = useContext(TeamsContext);
  const currentTeam =
    (round &&
      round.currentTeam &&
      teams.find((t) => t.id === round.currentTeam.id)) ||
    null;
  const canGuess: Array<FirebasePlayer> = currentTeam
    ? Object.values(currentTeam.players).filter(
        (val) => val.id !== round.currentPlayer.id
      )
    : [];

  return (
    <Box>
      <Box>
        <Typography variant="h3" align="center">
          Can guess the word:
        </Typography>
        <Box my={2}>
          <Typography align="center">
            {canGuess.map(
              (p, i) => `${p.name}${i === canGuess.length - 1 ? "." : ", "}`
            )}
          </Typography>
        </Box>
      </Box>
      <CurrentPlayerVideo />
    </Box>
  );
};

export default OtherPlayersView;
