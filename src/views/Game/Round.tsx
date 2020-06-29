import React, { useState, useContext, useEffect } from "react";
import Slider from "./Slider";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import TimerContext from "../../contexts/TimerContext";
import {
  useInterval,
  useHandleEndTurn,
  useCurrentPlayerIsOnDevice,
} from "../../hooks";
import moment from "moment";

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
    console.log("duration", duration);
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
      console.log("New end of current turn", currentRound.endOfCurrentTurn);
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
    <>
      <TimerContext.Provider value={[timeRemaining, stopTimer]}>
        <Slider openInstructions={openInstructions} />
        {/* <Box position="fixed" style={{ left: 0, bottom: 0, right: 0 }}>
        <RemoteCallsStrip audioOnly includeNames={false} />
      </Box> */}
      </TimerContext.Provider>
    </>
  );
};

export default Round;
