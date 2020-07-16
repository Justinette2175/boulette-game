import React, { useState, useContext, useEffect } from "react";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import TimerContext from "../../contexts/TimerContext";
import {
  useInterval,
  useHandleEndTurn,
  useCurrentPlayerIsOnDevice,
} from "../../hooks";
import moment from "moment";
import { Box } from "@material-ui/core";
import ScoreBoard from "../../components/ScoreBoard";
import TeamView from "./TeamView";

const INTERVAL_TIME = 1000;

interface IProps {}

const Round: React.FC<IProps> = () => {
  const currentRound = useContext(CurrentRoundContext);
  const [intervalRunning, setIntervalRunning] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(null);
  const handleEndTurn = useHandleEndTurn();
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();

  const stopTimer = () => {
    setIntervalRunning(false);
  };

  const updateRemainingTime = (endOfCurrentTurn: number) => {
    const now = moment().unix();
    console.log("endOfCurrentTurn", endOfCurrentTurn);
    console.log("NOW IS", now);
    let duration = endOfCurrentTurn - now;
    console.log("duration", duration);
    setTimeRemaining(duration);
    if (duration < 1 || isNaN(duration)) {
      stopTimer();
      if (currentPlayerIsOnDevice) {
        handleEndTurn();
      }
    }
  };

  useInterval(
    () => {
      if (currentRound) {
        updateRemainingTime(currentRound.endOfCurrentTurn);
      }
    },
    intervalRunning ? INTERVAL_TIME : null
  );

  useEffect(() => {
    if (currentRound && currentRound.endOfCurrentTurn) {
      setIntervalRunning(true);
    } else {
      setTimeRemaining(null);
      setIntervalRunning(false);
    }
  }, [currentRound && currentRound.endOfCurrentTurn]);

  const clearIfUnmount = () => {
    if (useCurrentPlayerIsOnDevice && timeRemaining) {
      handleEndTurn();
    }
  };

  useEffect(() => {
    return clearIfUnmount;
  }, []);

  const formattedTimeRemaining =
    timeRemaining === null
      ? currentRound?.remainingTimeFromPreviousRound ||
        currentRound?.secondsPerTurn
      : timeRemaining;

  return (
    <Box>
      <TimerContext.Provider value={[formattedTimeRemaining, stopTimer]}>
        <ScoreBoard />
        <TeamView />
      </TimerContext.Provider>
    </Box>
  );
};

export default Round;
