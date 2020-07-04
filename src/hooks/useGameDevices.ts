import React, { useState, useEffect, useContext } from "react";
import { FirebaseGameDevice } from "../types/firebaseTypes";
import useGameRef from "./useGameRef";
import GameContext from "../contexts/GameContext";
import FirebaseContext from "../firebase/FirebaseContext";

const useGameDevices = (): Array<FirebaseGameDevice> => {
  const game = useContext(GameContext);
  const firebase = useContext(FirebaseContext);
  const [devices, setDevices] = useState<Array<FirebaseGameDevice>>([]);

  const listenToGameDevices = () => {
    try {
      return firebase
        .firestore()
        .collection("games")
        .doc(game.id)
        .collection("devices")
        .onSnapshot((snap: any) => {
          const gameDevices: Array<FirebaseGameDevice> = [];
          snap.forEach((device: any) => {
            gameDevices.push({ ...device.data(), id: device.id });
          });
          setDevices(gameDevices);
        });
    } catch (e) {
      console.log("Error:useGameDevices:ListenToGameDevices", e);
    }
  };

  useEffect(() => {
    if (game?.id) {
      const unsubscribe = listenToGameDevices();
      return unsubscribe;
    }
  }, [game?.id]);

  return devices;
};

export default useGameDevices;
