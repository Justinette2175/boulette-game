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
  const [delay, setDelay] = useState<number>(0);
  const handleEndTurn = useHandleEndTurn();
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();

  const stopTimer = () => {
    setIntervalRunning(false);
  };

  const updateRemainingTime = (endOfCurrentTurn: number) => {
    const now = moment().unix();
    let duration = endOfCurrentTurn + delay / 1000 - now;
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

  const setTimestampDelay = (setAt: any) => {
    console.log("Setting timestamp deplay", setAt);
    const localNow = moment();
    const momentSetAt = moment.utc(setAt, "X");
    console.log(momentSetAt);
    const difference = localNow.diff(momentSetAt);
    setDelay(difference);
  };

  useEffect(() => {
    if (
      !!currentRound &&
      !!currentRound.endOfCurrentTurn &&
      !!currentRound.endOfCurrentTurnSetAt
    ) {
      setTimestampDelay(currentRound.endOfCurrentTurnSetAt);
      setIntervalRunning(true);
    } else {
      setTimeRemaining(null);
      setIntervalRunning(false);
    }
  }, [
    !!currentRound &&
      !!currentRound.endOfCurrentTurn &&
      !!currentRound.endOfCurrentTurnSetAt,
  ]);

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
