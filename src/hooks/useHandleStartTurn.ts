import { useContext } from "react";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import useGameRef from "./useGameRef";
import moment from "moment";

import { getNewWord } from "../utils";

const useHandleStartTurn = (): (() => void) => {
  const gameRef = useGameRef();
  const round = useContext(CurrentRoundContext);

  const handleStartTurn = async () => {
    const { remainingTimeFromPreviousRound, secondsPerTurn, wordsLeft } = round;

    // Set endOfCurrentTurn
    const secondLengthOfTurn: number =
      remainingTimeFromPreviousRound || secondsPerTurn;

    const nowInSeconds = moment().unix();
    const endOfCurrentTurn = nowInSeconds + secondLengthOfTurn;
    const currentWord = getNewWord(wordsLeft);

    await gameRef
      .collection("rounds")
      .doc(round.id)
      .update({ endOfCurrentTurn, currentWord });
  };

  return handleStartTurn;
};

export default useHandleStartTurn;
