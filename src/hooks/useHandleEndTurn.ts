import React, { useContext } from "react";
import useGameRef from "./useGameRef";
import FirebaseContext from "../firebase/FirebaseContext";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import { FirebasePlayer } from "../types/firebaseTypes";

const getNewPlayer = (
  players: { [key: string]: FirebasePlayer },
  lastPlayerToHavePlayed: FirebasePlayer
): FirebasePlayer => {
  const playerValues = Object.values(players).sort(
    (a, b) => a.createdAt - b.createdAt
  );
  const indexOfCurrentPlayer = lastPlayerToHavePlayed
    ? playerValues.findIndex((p) => p.id === lastPlayerToHavePlayed.id)
    : playerValues.length - 1;

  const newPlayerIndex =
    indexOfCurrentPlayer + 1 >= playerValues.length
      ? 0
      : indexOfCurrentPlayer + 1;

  return playerValues[newPlayerIndex];
};

const useHandleEndTurn = (): (() => void) => {
  const gameRef = useGameRef();
  const firebase = useContext(FirebaseContext);
  const round = useContext(CurrentRoundContext);

  const handleEndTurn = async () => {
    return firebase.firestore().runTransaction(async (transaction: any) => {
      const { currentTeam, wordsLeft, currentPlayer } = round;
      const newTeamId = !currentTeam || currentTeam.id === "2" ? "1" : "2";
      const newTeamSnap = await transaction.get(
        gameRef.collection("teams").doc(newTeamId)
      );
      const newTeam = { ...newTeamSnap.data(), id: newTeamId };
      const newPlayer = getNewPlayer(
        newTeam.players,
        newTeam.lastPlayerToHavePlayed
      );

      await transaction.update(gameRef.collection("rounds").doc(round.id), {
        endOfCurrentTurn: null,
        currentPlayer: newPlayer,
        currentTeam: newTeam,
        currentWord: null,
        remainingTimeFromPreviousRound: 0,
      });
      await transaction.update(
        gameRef.collection("teams").doc(currentTeam.id),
        {
          lastPlayerToHavePlayed: currentPlayer,
        }
      );
    });
  };

  return handleEndTurn;
};

export default useHandleEndTurn;
