import React from "react";
import { Box, Typography } from "@material-ui/core";
import { PALETTE_PURPLE_DARK } from "../../theme";
import { SCORE_BOARD_WIDTH } from "../../constants";
import { Team, RoundScore, TeamId } from "../../types";

interface IProps {
  orderedTeams: Array<Team>;
  currentTeamId: TeamId;
  currentRoundIndex: number;
  roundScore: RoundScore;
  cumulativeScore: RoundScore;
}

const ScoreBoardInterface: React.FC<IProps> = ({
  orderedTeams,
  currentTeamId,
  currentRoundIndex,
  roundScore,
  cumulativeScore,
}) => {
  const teamsMarkup = orderedTeams
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
          {cumulativeScore && (
            <Typography variant="body1">
              {cumulativeScore[t.id] || 0}
            </Typography>
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
      position="fixed"
      marginLeft={`${-SCORE_BOARD_WIDTH / 2}px`}
      top={0}
      left={
        !currentTeamId
          ? "50%"
          : currentTeamId === "1"
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

export default ScoreBoardInterface;
