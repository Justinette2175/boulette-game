import React, { useContext } from "react";
import { Box, Typography, Button } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import DisplayVideoContext from "../contexts/DisplayVideoContext";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      height: "55px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.dark,
      padding: `${theme.spacing(2)}px`,
      [theme.breakpoints.up("sm")]: {
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
      },
      [theme.breakpoints.up("md")]: {
        padding: `${theme.spacing(2)}px ${theme.spacing(6)}px`,
      },
      [theme.breakpoints.up("lg")]: {
        padding: `${theme.spacing(2)}px ${theme.spacing(8)}px`,
      },
    },
  });
});

interface NavbarProps {
  toggleDisplayVideos: () => void;
  hasVideo: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDisplayVideos, hasVideo }) => {
  const classes = useStyles();
  const [displayVideos] = useContext(DisplayVideoContext);
  return (
    <Box className={classes.container}>
      <Typography component="h1" style={{ fontWeight: 700 }}>
        boulette.ca
      </Typography>
      {hasVideo && (
        <Button size="small" variant="contained" onClick={toggleDisplayVideos}>
          {displayVideos ? "Hide Videos" : "Show Videos"}
        </Button>
      )}
    </Box>
  );
};

export default Navbar;
