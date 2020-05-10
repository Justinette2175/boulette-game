import React from "react";
import { useDispatch } from "react-redux";
import { Box, Typography, Button } from "@material-ui/core";
import { SCORE_BOARD_WIDTH } from "../constants";
import { Team, RoundScore, TeamId } from "../types";
import { updateInstructionsVisibility } from "../redux/computer";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  viewInstructionsLink: {
    padding: "7px 15px",
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
            textAlign: t.id === "1" ? "right" : "left",
          }}
        >
          <Typography>{t.name}</Typography>
          {roundScore && (
            <Typography style={{ fontSize: "2rem", fontWeight: 700 }}>
              {roundScore[t.id] || 0}
            </Typography>
          )}
          {cumulativeScore && (
            <Typography>{cumulativeScore[t.id] || 0}</Typography>
          )}
        </Box>
      );
    });

  const classes = useStyles();

  return (
    <Box width={`${SCORE_BOARD_WIDTH}px`} p={2}>
      <Box
        border="1px solid black"
        py={2}
        display="flex"
        justifyContent="space-between"
        alignItems="start"
      >
        {teamsMarkup[0]}
        <Box px={2}>
          <Typography variant="body1" align="center">
            Round
          </Typography>
          <Typography
            component="p"
            style={{ fontSize: "2rem", fontWeight: 700 }}
            align="center"
          >
            {currentRoundIndex}
          </Typography>
        </Box>
        {teamsMarkup[1]}
      </Box>
      <Button
        onClick={() => dispatch(updateInstructionsVisibility(true))}
        size="small"
      >
        Read round instructions
      </Button>
    </Box>
  );
};

export default ScoreBoardInterface;
