import React, { useContext, useState } from "react";
import { Code } from "../types/firebaseTypes";
import { FirebaseContext } from "../firebase";
import useGameRef from "./useGameRef";
import DeviceIdContext from "../contexts/DeviceIdContext";

const MAX_NUMBER_OF_DEVICES_FOR_PAID = 8;

const useUseCode = (): [(name: string) => void, boolean, Error] => {
  const gameRef = useGameRef();
  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>(null);

  const submitCode = async (code: string) => {
    try {
      setError(null);
      setLoading(true);
      await firebase.firestore().runTransaction(async (transaction: any) => {
        const codeRef = firebase.firestore().collection("codes").doc(code);

        const codeSnap = await transaction.get(codeRef);

        if (codeSnap.exists) {
          const codeData: Code = codeSnap.data();
          if (codeData.playsUsed < codeData.numberOfPlays) {
            await transaction.update(codeRef, {
              playsUsed: firebase.firestore.FieldValue.increment(1),
            });
            await transaction.update(gameRef, {
              "payment.paid": true,
              "payment.code": code,
              maxNumberOfDevices: MAX_NUMBER_OF_DEVICES_FOR_PAID,
            });
            setLoading(false);
          } else {
            throw new Error("This code is no longer valid.");
          }
        } else {
          throw new Error("This code is not valid.");
        }
      });
    } catch (e) {
      setLoading(false);
      console.log("Error:useUseCode:submitCode", e);
      setError(e);
      throw new Error(e);
    }
  };

  return [submitCode, loading, error];
};

export default useUseCode;
