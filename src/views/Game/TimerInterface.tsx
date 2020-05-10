import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Time } from "../../types";

interface IProps {
  timeLeft: Time;
}

const Timer: React.FC<IProps> = ({ timeLeft }) => {
  return (
    <>
      {timeLeft ? (
        <Typography variant="h1">
          {timeLeft.minutes < 10 && 0}
          {timeLeft.minutes}:{timeLeft.seconds < 10 && 0}
          {timeLeft.seconds}
        </Typography>
      ) : (
        <Typography variant="h1">00:00</Typography>
      )}
    </>
  );
};

export default Timer;
