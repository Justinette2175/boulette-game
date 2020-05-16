import React from "react";
import { useDispatch } from "react-redux";
import { BookOpen } from "react-feather";
import { Box, Typography, Button } from "@material-ui/core";
import { SCORE_BOARD_WIDTH } from "../constants";
import { Team, RoundScore, TeamId } from "../types";
import { updateInstructionsVisibility } from "../redux/computer";
import { useSelector } from "react-redux";
import { Store } from "../types";

import COPY from "../copy";

interface IProps {
  orderedTeams: Array<Team>;
  currentTeamId: TeamId;
  currentRoundIndex: number;
  roundScore: RoundScore;
  cumulativeScore: RoundScore;
}

const ScoreBoardInterface: React.FC<IProps> = ({
  orderedTeams,
  currentRoundIndex,
  roundScore,
  cumulativeScore,
}) => {
  const language = useSelector((state: Store) => state.computer.language);
  const dispatch = useDispatch();
  const teamsMarkup = orderedTeams
    .sort((t) => (t.id === "1" ? -1 : 1))
    .map((t) => {
      return (
        <Box
          width="100px"
          style={{
            textAlign: t.id === "1" ? "right" : "left",
          }}
        >
          <Typography
            style={{ fontWeight: 700 }}
            color={t.id === "1" ? "secondary" : "primary"}
          >
            {t.name}
          </Typography>
          <Box
            display="flex"
            justifyContent={t.id === "1" ? "flex-end" : "flex-start"}
          >
            {roundScore && (
              <Box
                order={t.id === "1" ? 1 : 0}
                marginLeft={t.id === "1" ? 2 : 0}
                marginRight={t.id === "1" ? 0 : 2}
              >
                <Typography
                  style={{ fontSize: "2rem", fontWeight: 700 }}
                  color={t.id === "1" ? "secondary" : "primary"}
                >
                  {roundScore[t.id] || 0}
                </Typography>
              </Box>
            )}
            {cumulativeScore && (
              <Box order={t.id === "1" ? 0 : 1}>
                <Typography>{cumulativeScore[t.id] || 0}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      );
    });

  return (
    <Box
      width={`${SCORE_BOARD_WIDTH}px`}
      p={2}
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Box display="flex" justifyContent="space-between" alignItems="start">
        {teamsMarkup[0]}
        <Box px={2}>
          <Typography variant="body1" align="center">
            {COPY.ROUND[language]}
          </Typography>
          <Typography component="p" style={{ fontSize: "2rem" }} align="center">
            {currentRoundIndex}
          </Typography>
        </Box>
        {teamsMarkup[1]}
      </Box>
      <Button
        onClick={() => dispatch(updateInstructionsVisibility(true))}
        size="small"
        variant="outlined"
        startIcon={<BookOpen size={14} />}
      >
        {COPY.READ_INSTRUCTIONS_BUTTON[language]}
      </Button>
    </Box>
  );
};

export default ScoreBoardInterface;
