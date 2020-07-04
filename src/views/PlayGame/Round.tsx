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

interface IProps {
  openInstructions: () => void;
}

const Round: React.FC<IProps> = ({ openInstructions }) => {
  const currentRound = useContext(CurrentRoundContext);
  const [intervalRunning, setIntervalRunning] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(null);
  const handleEndTurn = useHandleEndTurn();
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();

  const stopTimer = () => {
    setIntervalRunning(false);
    setTimeRemaining(null);
  };

  const updateRemainingTime = (endOfCurrentTurn: number) => {
    const now = moment().unix();
    let duration = endOfCurrentTurn - now;
    if (duration < 1 || isNaN(duration)) {
      stopTimer();
      if (currentPlayerIsOnDevice) {
        handleEndTurn();
      }
    } else {
      setTimeRemaining(duration);
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

  return (
    <Box>
      <TimerContext.Provider value={[timeRemaining, stopTimer]}>
        <ScoreBoard openInstructions={openInstructions} />
        <TeamView />
      </TimerContext.Provider>
    </Box>
  );
};

export default Round;
