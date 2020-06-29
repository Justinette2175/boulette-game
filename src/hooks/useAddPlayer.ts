import React, { useContext } from "react";
import { NewPlayer } from "../types/firebaseTypes";
import { FirebaseContext } from "../firebase";
import useGameRef from "./useGameRef";
import DeviceIdContext from "../contexts/DeviceIdContext";
import moment from "moment";

const useAddPlayer = (): ((name: string) => void) => {
  const gameRef = useGameRef();
  const deviceId = useContext(DeviceIdContext);
  const firebase = useContext(FirebaseContext);

  const addPlayer = async (name: string) => {
    try {
      await firebase.firestore().runTransaction(async (transaction: any) => {
        const team1 = await transaction.get(
          gameRef.collection("teams").doc("1")
        );
        const team2 = await transaction.get(
          gameRef.collection("teams").doc("2")
        );
        const { players: team1Players } = team1.data();
        const { players: team2Players } = team2.data();

        const nextTeam =
          !team2Players ||
          Object.keys(team2Players).length < Object.keys(team1Players).length
            ? "2"
            : "1";

        const newPlayerRef = gameRef.collection("players").doc();
        const newPlayer: NewPlayer = {
          id: newPlayerRef.id,
          deviceId,
          name,
          createdAt: moment().unix(),
        };
        await transaction.update(gameRef.collection("teams").doc(nextTeam), {
          [`players.${newPlayerRef.id}`]: newPlayer,
        });
        await transaction.set(newPlayerRef, newPlayer);
      });
    } catch (e) {
      console.log("Error:useAddPlayer:addPlayer");
    }
  };

  return addPlayer;
};

export default useAddPlayer;
