import React, { useContext } from "react";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import useGameRef from "./useGameRef";
import FirebaseContext from "../firebase/FirebaseContext";
import { FirebasePlayer, FirebaseGameRound } from "../types/firebaseTypes";

const getNewPlayer = (
  players: { [key: string]: FirebasePlayer },
  currentPlayer: FirebasePlayer
): FirebasePlayer => {
  const playerValues = Object.values(players).sort(
    (a, b) => a.createdAt - b.createdAt
  );
  const indexOfCurrentPlayer = currentPlayer
    ? playerValues.findIndex((p) => p.id === currentPlayer.id)
    : playerValues.length - 1;

  const newPlayerIndex =
    indexOfCurrentPlayer + 1 >= playerValues.length
      ? 0
      : indexOfCurrentPlayer + 1;

  return playerValues[newPlayerIndex];
};

const useHandleEndTurn = (round: FirebaseGameRound): (() => void) => {
  const gameRef = useGameRef();
  const firebase = useContext(FirebaseContext);

  const handleEndTurn = async () => {
    return firebase.firestore().runTransaction(async (transaction: any) => {
      const { currentTeam, wordsLeft, currentPlayer } = round;
      const newTeamId = !currentTeam || currentTeam.id === "2" ? "1" : "2";
      const newTeamSnap = await transaction.get(
        gameRef.collection("teams").doc(newTeamId)
      );
      const newTeam = { ...newTeamSnap.data(), id: newTeamId };
      const newPlayer = getNewPlayer(newTeam.players, currentPlayer);

      await transaction.update(gameRef.collection("rounds").doc(round.id), {
        endOfCurrentTurn: null,
        currentPlayer: newPlayer,
        currentTeam: newTeam,
        currentWord: null,
      });
    });
  };

  return handleEndTurn;
};

export default useHandleEndTurn;
