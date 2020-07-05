import React from "react";
import { Box, Typography, Button, useTheme } from "@material-ui/core";
import { RoundScore, TeamId } from "../types";
import { FirebaseGameTeam } from "../types/firebaseTypes";

import COPY from "../copy";

interface IProps {
  orderedTeams: Array<FirebaseGameTeam>;
  currentTeamId: TeamId;
  roundScore: RoundScore;
  cumulativeScore: RoundScore;
}

const ScoreBoardInterface: React.FC<IProps> = ({
  orderedTeams,
  roundScore,
  cumulativeScore,
}) => {
  const language = "EN";

  const theme = useTheme();

  return (
    <Box width="100%" bgcolor="secondary.light">
      <Box bgcolor="secondary.light" display="flex">
        {orderedTeams.map((t) => {
          return (
            <Box
              bgcolor={t.id === "1" ? "primary.main" : "primary.light"}
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
              {roundScore && cumulativeScore && (
                <Box display="flex">
                  <Box paddingX={1} order={t.id === "1" ? 1 : 0}>
                    <Typography
                      style={{
                        marginBottom: 0,
                        fontSize: "2rem",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      {cumulativeScore[t.id] || 0}
                    </Typography>
                  </Box>
                  <Box paddingX={1}>
                    <Typography
                      style={{
                        marginBottom: 0,
                        fontSize: "1rem",
                        fontWeight: 500,
                      }}
                      align="center"
                    >
                      {roundScore[t.id] || 0}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ScoreBoardInterface;
