import React, { useContext } from "react";
import { Box, Typography, Button, Container } from "@material-ui/core";
import { Link } from "react-router-dom";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import DisplayVideoContext from "../contexts/DisplayVideoContext";
import { SidePaddingWrapper } from "./Containers";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      height: "55px",
      display: "flex",
      alignItems: "center",
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.dark,
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
      <Container disableGutters maxWidth="lg">
        <SidePaddingWrapper>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              component={Link}
              to="/"
              style={{ fontWeight: 700, marginBottom: 0, color: "white" }}
            >
              boulette.ca
            </Typography>
            {hasVideo && (
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={toggleDisplayVideos}
              >
                {displayVideos ? "Hide Videos" : "Show Videos"}
              </Button>
            )}
          </Box>
        </SidePaddingWrapper>
      </Container>
    </Box>
  );
};

export default Navbar;
