import { useContext } from "react";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import useGameRef from "./useGameRef";
import FirebaseContext from "../firebase/FirebaseContext";

import { getNewWord } from "../utils";
import TimerContext from "../contexts/TimerContext";

const useHandleWordFound = (): ((wordFoundId: string) => void) => {
  const gameRef = useGameRef();
  const firebase = useContext(FirebaseContext);
  const round = useContext(CurrentRoundContext);
  const [timeRemaining, stopTimer] = useContext(TimerContext);

  const handleWordFound = async (wordFoundId: string) => {
    let newWord;
    const { wordsLeft, currentPlayer, currentTeam } = round;
    wordsLeft[wordFoundId].foundBy = currentPlayer.id;
    newWord = getNewWord(wordsLeft);

    const batch = firebase.firestore().batch();

    batch.update(gameRef.collection("rounds").doc(round.id), {
      [`score.${currentTeam.id}`]: firebase.firestore.FieldValue.increment(1),
      currentWord: newWord,
      [`wordsLeft.${wordFoundId}.foundBy`]: currentPlayer.id,
    });

    batch.update(gameRef, {
      [`score.${currentTeam.id}`]: firebase.firestore.FieldValue.increment(1),
    });

    await batch.commit();

    // Set currentWord, update wordsLeft, and update score

    if (!newWord) {
      // Get next round
      const remainingTime = timeRemaining;
      stopTimer();
      await firebase.firestore().runTransaction(async (transaction: any) => {
        const nextRoundId = (parseInt(round.id) + 1).toString();
        const nextRoundSnap = await transaction.get(
          gameRef.collection("rounds").doc(nextRoundId)
        );
        if (nextRoundSnap.exists) {
          await transaction.update(gameRef, {
            currentRound: nextRoundId,
          });
          await transaction.update(
            gameRef.collection("rounds").doc(nextRoundId),
            {
              currentPlayer,
              currentTeam,
              remainingTimeFromPreviousRound: remainingTime || 0,
            }
          );
        } else {
          await transaction.update(gameRef, {
            stage: "ENDED",
          });
        }
      });
    }
  };

  return handleWordFound;
};

export default useHandleWordFound;
