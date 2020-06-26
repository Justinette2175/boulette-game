import React, { useState, useContext, useEffect } from "react";
import Slider from "./Slider";
import RoundInstructions from "./RoundInstructions";
import { FirebaseGameRound } from "../../types/firebaseTypes";
import GameContext from "../../contexts/GameContext";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import { useGameRef } from "../../hooks";

const Game: React.FC = () => {
  const game = useContext(GameContext);
  const gameRef = useGameRef();
  const [currentRound, setCurrentRound] = useState<FirebaseGameRound>(null);

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
      const unsubscribe = listenToCurrentRound(game.currentRound.id);
      return unsubscribe;
    }
  }, [game.currentRound]);

  return (
    <>
      <CurrentRoundContext.Provider value={currentRound}>
        <Slider />
        {/* <RoundInstructions /> */}
        {/* <Box position="fixed" style={{ left: 0, bottom: 0, right: 0 }}>
        <RemoteCallsStrip audioOnly includeNames={false} />
      </Box> */}
      </CurrentRoundContext.Provider>
    </>
  );
};

export default Game;
