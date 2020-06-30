import React from "react";
import { BookOpen } from "react-feather";
import { Box, Typography, Button, useTheme } from "@material-ui/core";
import { RoundScore, TeamId } from "../types";
import { FirebaseGameTeam } from "../types/firebaseTypes";

import COPY from "../copy";

interface IProps {
  orderedTeams: Array<FirebaseGameTeam>;
  currentTeamId: TeamId;
  currentRoundIndex: string;
  roundScore: RoundScore;
  cumulativeScore: RoundScore;
  openInstructions: () => void;
}

const ScoreBoardInterface: React.FC<IProps> = ({
  orderedTeams,
  currentRoundIndex,
  roundScore,
  cumulativeScore,
  openInstructions,
}) => {
  const language = "EN";

  const theme = useTheme();

  const teamsMarkup = orderedTeams.map((t) => {
    return (
      <Box
        bgcolor={t.id === "1" ? "secondary.main" : "secondary.light"}
        px={2}
        py={1}
        display="flex"
        flexGrow={1}
        flexDirection="column"
        alignItems={t.id === "1" ? "flex-end" : "flex-start"}
      >
        <Typography
          align="center"
          style={{
            marginBottom: 0,
            fontWeight: 500,
          }}
        >
          {t.name || `Team ${t.id}`}
        </Typography>
        {roundScore && (
          <Box>
            <Typography
              style={{
                marginBottom: 0,
                fontSize: "2rem",
                fontWeight: 500,
                color: theme.palette.primary.main,
              }}
              align="center"
            >
              {roundScore[t.id] || 0}
            </Typography>
          </Box>
        )}
      </Box>
    );
  });

  return (
    <Box width="100%" bgcolor="secondary.light">
      <Box
        display="flex"
        alignItems="center"
        bgcolor="secondary.dark"
        px={2}
        py={1}
      >
        <Box mr={2}>
          <Typography
            variant="body1"
            style={{
              marginBottom: 0,
              color: theme.palette.secondary.contrastText,
              fontWeight: 500,
            }}
          >
            {COPY.ROUND[language]} {currentRoundIndex}
          </Typography>
        </Box>
        <Button
          onClick={openInstructions}
          size="small"
          variant="contained"
          color="primary"
          startIcon={<BookOpen size={14} />}
        >
          {COPY.READ_INSTRUCTIONS_BUTTON[language]}
        </Button>
      </Box>
      <Box bgcolor="secondary.light" display="flex">
        {teamsMarkup[0]}
        {teamsMarkup[1]}
      </Box>
    </Box>
  );
};

export default ScoreBoardInterface;
