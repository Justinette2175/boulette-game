import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Time } from "../../types";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    timer: {
      fontFamily: "DM Mono !important",
      fontWeight: 500,
      fontSize: "2.7rem",
      margin: 0,
    },
  });
});

interface IProps {
  timeLeft: Time;
}

const Timer: React.FC<IProps> = ({ timeLeft }) => {
  const classes = useStyles();
  return (
    <>
      {timeLeft ? (
        <p className={classes.timer}>
          {timeLeft.minutes < 10 && 0}
          {timeLeft.minutes}:{timeLeft.seconds < 10 && 0}
          {timeLeft.seconds}
        </p>
      ) : (
        <Typography variant="h1">00:00</Typography>
      )}
    </>
  );
};

export default Timer;
