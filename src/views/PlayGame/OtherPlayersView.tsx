import React from "react";
import { Box, useTheme, Typography, Grid } from "@material-ui/core";
import CurrentPlayerVideo from "./CurrentPlayerVideo";

interface IProps {}

const OtherPlayersView: React.FC<IProps> = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box>
        <Typography variant="h3" align="center">
          The following players can guess the word
        </Typography>
        <Box my={2}>
          <Grid container spacing={2}></Grid>
        </Box>
      </Box>
      <CurrentPlayerVideo />
    </Box>
  );
};

export default OtherPlayersView;
