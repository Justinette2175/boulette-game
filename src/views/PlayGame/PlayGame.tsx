import React, { useState, useContext, useEffect } from "react";
import RoundInstructions from "./RoundInstructions";
import { FirebaseGameRound } from "../../types/firebaseTypes";
import GameContext from "../../contexts/GameContext";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import { useGameRef } from "../../hooks";
import Round from "./Round";
import { Box } from "@material-ui/core";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";
import RoundAndInstructions from "../../components/RoundAndInstructions";

const Game: React.FC = () => {
  const game = useContext(GameContext);
  const [callsDisplayed, setCallsDisplayed] = useState<boolean>(true);
  const gameRef = useGameRef();
  const [currentRound, setCurrentRound] = useState<FirebaseGameRound>(null);
  const [instructionsVisible, setInstructionsVisible] = useState<boolean>(
    false
  );

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

  return (
    <>
      <CurrentRoundContext.Provider value={currentRound}>
        <RoundAndInstructions
          openInstructions={() => setInstructionsVisible(true)}
          callsDisplayed={callsDisplayed}
          setCallsDisplayed={setCallsDisplayed}
        />
        {callsDisplayed && <RemoteCallsStrip />}
        <Round />
        <RoundInstructions
          open={instructionsVisible}
          onClose={() => setInstructionsVisible(false)}
        />
      </CurrentRoundContext.Provider>
    </>
  );
};

export default Game;
