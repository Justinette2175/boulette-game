import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import useCurrentRoundIndex from "../../utils/useCurrentRoundIndex";
import { Store, Round, RoundScore } from "../../types";
import { PALETTE_PURPLE_DARK } from "../../theme";
import { SCORE_BOARD_WIDTH } from "../../constants";

const ScoreBoard: React.FC = () => {
  let currentTeam = useSelector((state: Store) => state.game.currentTeam);
  const currentRoundIndex = useCurrentRoundIndex();
  const teams = useSelector((state: Store) => state.game.teams);
  const roundScore: RoundScore = useSelector((state: Store) => {
    if (state.game.currentRound) {
      const round: Round = state.game.rounds.find(
        (r) => r.id === state.game.currentRound
      );
      return round ? round.score : null;
    }
    return null;
  });

  const cumulativeSore: RoundScore = useSelector((state: Store) => {
    return state.game.rounds.reduce((acc: any, r) => {
      if (r.score) {
        Object.keys(r.score).forEach((teamId) => {
          if (acc[teamId]) {
            acc[teamId] += r.score[teamId];
          } else {
            acc[teamId] = r.score[teamId];
          }
        });
      }
      return acc;
    }, {});
  });

  const teamsMarkup = teams
    .sort((t) => (t.id === "1" ? -1 : 1))
    .map((t) => {
      return (
        <Box
          width="100px"
          style={{ color: "white", textAlign: t.id === "1" ? "right" : "left" }}
        >
          <Typography variant="body1">{t.name}</Typography>
          {roundScore && (
            <Typography variant="h1">{roundScore[t.id] || 0}</Typography>
          )}
          {cumulativeSore && (
            <Typography variant="body1">{cumulativeSore[t.id] || 0}</Typography>
          )}
        </Box>
      );
    });

  return (
    <Box
      width={`${SCORE_BOARD_WIDTH}px`}
      display="flex"
      justifyContent="space-between"
      alignItems="start"
      position="absolute"
      marginLeft={`${-SCORE_BOARD_WIDTH / 2}px`}
      left={
        !currentTeam
          ? "50%"
          : currentTeam === "1"
          ? `calc(100% - ${SCORE_BOARD_WIDTH / 2}px)`
          : `${SCORE_BOARD_WIDTH / 2}px`
      }
      style={{ transition: "all 1s" }}
    >
      {teamsMarkup[0]}
      <Box
        px={2}
        py={1}
        style={{ backgroundColor: PALETTE_PURPLE_DARK, color: "white" }}
      >
        <Typography variant="body1">Round {currentRoundIndex}</Typography>
      </Box>
      {teamsMarkup[1]}
    </Box>
  );
};

export default ScoreBoard;
