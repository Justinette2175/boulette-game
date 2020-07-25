import { useContext } from "react";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import useGameRef from "./useGameRef";
import moment from "moment";

import { getNewWord } from "../utils";
import FirebaseContext from "../firebase/FirebaseContext";

const useHandleStartTurn = (): (() => void) => {
  const gameRef = useGameRef();
  const round = useContext(CurrentRoundContext);
  const firebase = useContext(FirebaseContext);

  const handleStartTurn = async () => {
    const { remainingTimeFromPreviousRound, secondsPerTurn, wordsLeft } = round;

    // Set endOfCurrentTurn
    const secondLengthOfTurn: number =
      remainingTimeFromPreviousRound || secondsPerTurn;

    const nowInSeconds = moment().unix();
    const endOfCurrentTurn = nowInSeconds + secondLengthOfTurn;
    const currentWord = getNewWord(wordsLeft);
    const endOfCurrentTurnSetAt = moment().unix();
    await gameRef
      .collection("rounds")
      .doc(round.id)
      .update({ endOfCurrentTurn, endOfCurrentTurnSetAt, currentWord });
  };

  return handleStartTurn;
};

export default useHandleStartTurn;
