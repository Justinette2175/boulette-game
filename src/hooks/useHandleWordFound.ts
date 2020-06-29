import { useContext } from "react";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import useGameRef from "./useGameRef";
import FirebaseContext from "../firebase/FirebaseContext";

import { getNewWord } from "../utils";

const useHandleWordFound = (): ((
  remainingTime: number,
  wordFoundId: string
) => void) => {
  const gameRef = useGameRef();
  const firebase = useContext(FirebaseContext);
  const round = useContext(CurrentRoundContext);

  const handleWordFound = async (
    remainingTime: number,
    wordFoundId: string
  ) => {
    let newWord;
    const { wordsLeft, currentPlayer, currentTeam } = round;
    wordsLeft[wordFoundId].foundBy = currentPlayer.id;
    newWord = getNewWord(wordsLeft);

    await gameRef
      .collection("rounds")
      .doc(round.id)
      .update({
        [`score.${currentTeam.id}`]: firebase.firestore.FieldValue.increment(1),
        currentWord: newWord,
        [`wordsLeft.${wordFoundId}.foundBy`]: currentPlayer.id,
      });

    // Set currentWord, update wordsLeft, and update score

    if (!newWord) {
      // Get next round
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
          // Finish game
        }
      });
    }
  };

  return handleWordFound;
};

export default useHandleWordFound;
