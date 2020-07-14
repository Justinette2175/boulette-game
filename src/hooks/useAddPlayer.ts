import React, { useContext, useState } from "react";
import { NewPlayer, FirebaseGame } from "../types/firebaseTypes";
import { FirebaseContext } from "../firebase";
import useGameRef from "./useGameRef";
import DeviceIdContext from "../contexts/DeviceIdContext";
import moment from "moment";

interface UseAddPlayerOptions {
  sameDevice?: boolean;
}

const useAddPlayer = (
  options?: UseAddPlayerOptions
): [(name: string) => void, boolean, Error] => {
  const gameRef = useGameRef();
  const deviceId = useContext(DeviceIdContext);
  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>(null);

  const addPlayer = async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      await firebase.firestore().runTransaction(async (transaction: any) => {
        const updatedGameSnap = await transaction.get(gameRef);
        const updatedGame: FirebaseGame = updatedGameSnap.data();
        if (
          !options ||
          options.sameDevice ||
          updatedGame?.numberOfDevices < updatedGame?.maxNumberOfDevices
        ) {
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
          const isCaptain =
            !team2Players || Object.keys(team2Players).length === 0;

          if (isCaptain) {
            await transaction.update(
              gameRef.collection("teams").doc(nextTeam),
              {
                captain: newPlayer,
              }
            );
          }
          if (!options?.sameDevice) {
            await transaction.update(gameRef, {
              numberOfDevices: firebase.firestore.FieldValue.increment(1),
              [`devices.${deviceId}`]: true,
            });
          }
          await transaction.set(newPlayerRef, newPlayer);
          setLoading(false);
        } else {
          console.log("Can't join too many");
          throw new Error(
            "Cannot join game because there already are too many players."
          );
        }
      });
    } catch (e) {
      console.log("Error:useAddPlayer:addPlayer");
      setLoading(false);
      setError(e);
    }
  };

  return [addPlayer, loading, error];
};

export default useAddPlayer;
