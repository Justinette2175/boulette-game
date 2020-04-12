import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography } from "@material-ui/core";
import { startNextTurn } from "../../redux/game";
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

  const handleClick = () => {
    dispatch(startNextTurn());
  };

  return (
    <div>
      THE GAME HAS NOW STARTED!
      <Typography variant="h3">{currentTeamName}</Typography>
      <Typography variant="body1">It is {currentPlayerName}'s turn</Typography>
      {currentRoundIndex && (
        <Typography variant="h4">Round {currentRoundIndex}</Typography>
      )}
      <CurrentPlayerView />
    </div>
  );
};

export default Game;
