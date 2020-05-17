import React, { useState } from "react";
import { Box, Button, Dialog, Typography, useTheme } from "@material-ui/core";
import { Linkedin, Smile } from "react-feather";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import Donate from "./Donate";

const LINKED_IN = "https://www.linkedin.com/in/justinegagnepain/";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    dialog: {
      width: "100%",
      "& p": {
        maxWidth: "1000px",
      },
    },
  });
});

const AboutMe = () => {
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const classes = useStyles();
  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<Smile />}
      >
        About
      </Button>
      <Dialog
        classes={{ paper: classes.dialog }}
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        style={{ width: "100%" }}
      >
        <Box p={6} width="100%">
          <Typography variant="h2">Thanks for playing boulette!</Typography>
          <Typography variant="body2">
            My name is Justine and I'm a freelance web developer based out of
            Montreal, Canada. I made this game during the COVID-19 pandemic
            lockdown to play my favorite game with my friends and family.
          </Typography>
          <Box my={3}>
            <Typography variant="body2">
              If you're enjoying playing, please consider making a small
              contribution. Hosting on servers is expensive and I can only keep
              the game online if I can cover my costs!
            </Typography>
            <Box mt={2}>
              <Donate />
            </Box>
          </Box>

          <Typography variant="body2">
            If you'd like me to work on a development project for you, contact
            me on LinkedIn. I'll be happy to get back to you!
          </Typography>
          <Box mt={1}>
            <a href={LINKED_IN} target="_blank" rel="noopener noreferrer">
              <Button
                color="primary"
                size="small"
                endIcon={
                  <Linkedin size={18} color={theme.palette.primary.main} />
                }
              >
                Chat with me on LinkedIn
              </Button>
            </a>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AboutMe;
