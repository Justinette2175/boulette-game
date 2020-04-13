import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box } from "@material-ui/core";
import { Store, User, Team, Round } from "../../types";
import { SCORE_BOARD_WIDTH } from "../../constants";

import CurrentPlayerView from "./CurrentPlayerView";
import ScoreBoard from "./ScoreBoard";
import Timer from "./Timer";

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const currentTeam = useSelector((state: Store) => state.game.currentTeam);
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

  return (
    <Box>
      <ScoreBoard />
      <Timer />
      <Box
        width={`calc(100% - ${SCORE_BOARD_WIDTH / 2}px)`}
        position="relative"
        style={{ transition: "all 1s" }}
        left={currentTeam === "1" ? 0 : `${SCORE_BOARD_WIDTH / 2}px`}
      >
        {currentPlayerIsOnComputer && <CurrentPlayerView />}
      </Box>
    </Box>
  );
};

export default Game;
