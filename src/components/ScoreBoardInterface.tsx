import React from "react";
import { useDispatch } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import { SCORE_BOARD_WIDTH } from "../constants";
import { Team, RoundScore, TeamId } from "../types";
import { NEON_GREEN, NEON_YELLOW } from "../theme";
import { updateInstructionsVisibility } from "../redux/computer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  viewInstructionsLink: {
    padding: "7px 15px",
    color: NEON_YELLOW,
    transition: ".25s",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },
});

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
  const dispatch = useDispatch();

  const teamsMarkup = orderedTeams
    .sort((t) => (t.id === "1" ? -1 : 1))
    .map((t) => {
      return (
        <Box
          width="100px"
          style={{
            color: NEON_GREEN,
            textAlign: t.id === "1" ? "right" : "left",
          }}
        >
          <Typography variant="body1">{t.name}</Typography>
          {roundScore && (
            <Typography variant="h1">{roundScore[t.id] || 0}</Typography>
          )}
          {cumulativeScore && (
            <Typography variant="h3" component="p">
              {cumulativeScore[t.id] || 0}
            </Typography>
          )}
        </Box>
      );
    });

  const classes = useStyles();

  return (
    <Box
      width={`${SCORE_BOARD_WIDTH}px`}
      display="flex"
      justifyContent="space-between"
      alignItems="start"
    >
      {teamsMarkup[0]}
      <Box
        px={2}
        py={1}
        onClick={() => dispatch(updateInstructionsVisibility(true))}
        className={classes.viewInstructionsLink}
      >
        <Typography
          variant="caption"
          component="p"
          align="center"
          style={{
            color: NEON_YELLOW,
          }}
        >
          Instructions
        </Typography>
        <Typography variant="h4" component="p" align="center">
          Round
        </Typography>
        <Typography variant="h1" component="p" align="center">
          {currentRoundIndex}
        </Typography>
      </Box>
      {teamsMarkup[1]}
    </Box>
  );
};

export default ScoreBoardInterface;
