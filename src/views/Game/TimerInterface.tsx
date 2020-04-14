import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import useCurrentRoundIndex from "../../utils/useCurrentRoundIndex";
import { Store, User, Time } from "../../types";

interface IProps {
  timeLeft: Time;
  currentPlayerName: string;
}

const Timer: React.FC<IProps> = ({ timeLeft, currentPlayerName }) => {
  return (
    <Box
      width="100%"
      style={{ color: "white" }}
      p={4}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2">It's {currentPlayerName}'s turn</Typography>
      {timeLeft && (
        <Typography variant="h1">
          {timeLeft.minutes < 10 && 0}
          {timeLeft.minutes}:{timeLeft.seconds < 10 && 0}
          {timeLeft.seconds}
        </Typography>
      )}
    </Box>
  );
};

export default Timer;
