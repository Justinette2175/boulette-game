import React, { useEffect, useState, useRef, useContext } from "react";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import { FirebaseContext } from "../../firebase";

import { useGameRef } from "../../hooks";
import GameContext from "../../contexts/GameContext";
import {
  MutedState,
  FirebaseGameDevice,
  JitsiTracks,
} from "../../types/firebaseTypes";
import Twillio from "../../services/twillio";
import TwillioContext from "../../contexts/TwillioContext";

interface IProps {}

export const TwillioWrapper: React.FC<IProps> = ({ children }) => {
  const game = useContext(GameContext);
  const twillio = useRef<Twillio>(null);
  const deviceId = useContext(DeviceIdContext);
  const firebase = useContext(FirebaseContext);
  const [existingTracksIds, setExistingTracksIds] = useState<JitsiTracks>({});
  const [permissionModalVisible, setPermissionModalVisible] = useState<boolean>(
    false
  );
  const [connected, setConnected] = useState(false);

  console.log("esixting tracks", existingTracksIds);

  const updateTrackExistence = (id: string, sid: string, exists: boolean) => {
    setExistingTracksIds((ex) => ({
      ...ex,
      [id]: { ...ex[id], sid, exists },
    }));
  };

  const updateMuteState = (
    id: string,
    trackType: "audio" | "video",
    isOn: boolean
  ) => {
    setExistingTracksIds((ex) => ({
      ...ex,
      [id]: {
        ...ex[id],
        muted: {
          ...ex[id].muted,
          [trackType]: isOn,
        },
      },
    }));
  };

  const initiateCall = async () => {
    try {
      const tokenData = await firebase.functions.httpsCallable(
        "generateTwillioToken"
      )({ gameId: game.id, deviceId });
      const token = tokenData.data;
      const myTwillio = new Twillio(
        game.id,
        token,
        () => setConnected(true),
        updateTrackExistence,
        () => setPermissionModalVisible(false),
        updateMuteState
      );
      twillio.current = myTwillio;
    } catch (e) {
      console.log("Error:TwillioWrapper:initiateCall", e);
    }
  };

  useEffect(() => {
    if (game?.id) {
      initiateCall();
    }
    return async () => {
      twillio.current = null;
    };
  }, [game?.id]);

  return (
    <TwillioContext.Provider
      value={[twillio?.current, existingTracksIds, connected]}
    >
      {children}
      {/* <PermissionsModal
        open={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
      /> */}
    </TwillioContext.Provider>
  );
};

export default TwillioWrapper;
