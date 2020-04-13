import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box } from "@material-ui/core";
import { Store, User, Team, Round } from "../../types";

import CurrentPlayerView from "./CurrentPlayerView";

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const currentPlayerName = useSelector((state: Store) => {
    if (state.game.currentUser) {
      const user: User = state.game.users.find(
        (u) => u.id === state.game.currentUser
      );
      return user ? user.name : null;
    }
    return null;
  });
  const currentPlayerIsOnComputer = useSelector(
    (state: Store) =>
      state.game.currentUser &&
      state.computer.users.indexOf(state.game.currentUser) > -1
  );
  const currentTeamName = useSelector((state: Store) => {
    if (state.game.currentTeam) {
      const team: Team = state.game.teams.find(
        (t) => t.id === state.game.currentTeam
      );
      return team ? team.name : null;
    }
    return null;
  });
  const currentRoundIndex: number = useSelector((state: Store) => {
    if (state.game.currentTeam) {
      const round: Round = state.game.rounds.find(
        (r) => r.id === state.game.currentRound
      );
      return round ? round.index : null;
    }
    return null;
  });

  const secondsLeft: number = useSelector(
    (state: Store) => state.computer.timer
  );

  return (
    <Box>
      <Typography variant="h3">{currentTeamName}</Typography>
      <Typography variant="body1">It is {currentPlayerName}'s turn</Typography>
      {secondsLeft ||
        (secondsLeft === 0 && (
          <Typography variant="body1">{secondsLeft} seconds</Typography>
        ))}
      {currentRoundIndex && (
        <Typography variant="h4">Round {currentRoundIndex}</Typography>
      )}
      {currentPlayerIsOnComputer && <CurrentPlayerView />}
    </Box>
  );
};

export default Game;
