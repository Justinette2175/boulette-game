import React from "react";
import { Box, useTheme, Typography } from "@material-ui/core";
import CurrentPlayerVideo from "./CurrentPlayerVideo";
import { NEON_YELLOW } from "../../theme";

const OtherPlayersView: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      flexGrow={1}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      marginX={`-${theme.spacing(4)}px`}
      marginBottom={`-${theme.spacing(6)}px`}
      marginTop={4}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h3" align="center" style={{ color: NEON_YELLOW }}>
          If you're on this team, guess!
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={{ color: NEON_YELLOW }}
          gutterBottom
        >
          When you have the answer, say it so your teammate can mark the points.
        </Typography>
      </Box>
      <CurrentPlayerVideo />
    </Box>
  );
};

export default OtherPlayersView;
