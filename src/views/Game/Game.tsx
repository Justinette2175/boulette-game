import React, { useState, useContext, useEffect } from "react";
import Slider from "./Slider";
import RoundInstructions from "./RoundInstructions";
import { FirebaseGameRound } from "../../types/firebaseTypes";
import GameContext from "../../contexts/GameContext";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import { useGameRef, useInterval, useHandleEndTurn } from "../../hooks";
import moment from "moment";

const INTERVAL_TIME = 1000;

const Game: React.FC = () => {
  const game = useContext(GameContext);
  const gameRef = useGameRef();
  const [currentRound, setCurrentRound] = useState<FirebaseGameRound>(null);
  const [instructionsVisible, setInstructionsVisible] = useState<boolean>(
    false
  );
  const [intervalRunning, setIntervalRunning] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(null);
  const handleEndTurn = useHandleEndTurn(currentRound);

  const listenToCurrentRound = (roundId: string) => {
    try {
      return gameRef
        .collection("rounds")
        .doc(roundId)
        .onSnapshot((doc: any) => {
          if (doc.exists) {
            setCurrentRound({ ...doc.data(), id: doc.id });
          }
        });
    } catch (e) {
      console.log("Error:Game:listenToCurrentRound", e);
    }
  };

  useEffect(() => {
    if (game.currentRound) {
      const unsubscribe = listenToCurrentRound(game.currentRound);
      setInstructionsVisible(true);
      return unsubscribe;
    }
  }, [game.currentRound]);

  const updateRemainingTime = (endOfCurrentTurn: number) => {
    const now = moment().unix();
    let duration = endOfCurrentTurn - now;
    console.log("duration", duration);
    if (duration < 1 || isNaN(duration)) {
      setIntervalRunning(false);
      duration = null;
      console.log("end turn");
      handleEndTurn();
    }

    setTimeRemaining(duration);
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

  return (
    <>
      <CurrentRoundContext.Provider value={currentRound}>
        <Slider openInstructions={() => setInstructionsVisible(true)} />
        <RoundInstructions
          open={instructionsVisible}
          onClose={() => setInstructionsVisible(false)}
        />
        {/* <Box position="fixed" style={{ left: 0, bottom: 0, right: 0 }}>
        <RemoteCallsStrip audioOnly includeNames={false} />
      </Box> */}
      </CurrentRoundContext.Provider>
    </>
  );
};

export default Game;
