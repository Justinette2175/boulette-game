import React, { useEffect, useState, useRef, useContext } from "react";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import { FirebaseContext } from "../../firebase";

import GameContext from "../../contexts/GameContext";
import { VideoTracks } from "../../types/firebaseTypes";
import Twillio from "../../services/twillio";
import TwillioContext from "../../contexts/TwillioContext";
import DisplayVideoContext from "../../contexts/DisplayVideoContext";

import PermissionsModal from "../../components/PermissionsModal";

interface IProps {}

export const TwillioWrapper: React.FC<IProps> = ({ children }) => {
  const game = useContext(GameContext);
  const twillio = useRef<Twillio>(null);
  const deviceId = useContext(DeviceIdContext);
  const firebase = useContext(FirebaseContext);
  const [existingTracksIds, setExistingTracksIds] = useState<VideoTracks>({});
  const [permissionModalVisible, setPermissionModalVisible] = useState<boolean>(
    false
  );
  const [connected, setConnected] = useState(false);
  const [_, setDisplayVideo] = useContext(DisplayVideoContext);

  const updateTrackExistence = (id: string, sid: string, exists: boolean) => {
    setExistingTracksIds((ex) => ({
      ...ex,
      [id]: {
        ...ex[id],
        sid,
        exists,
        on: {
          audio: true,
          video: true,
        },
      },
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
        on: {
          ...ex[id]?.on,
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
        (newState: boolean) => setPermissionModalVisible(newState),
        updateMuteState
      );
      twillio.current = myTwillio;
    } catch (e) {
      console.log("Error:TwillioWrapper:initiateCall", e);
    }
  };

  useEffect(() => {
    if (
      !twillio.current &&
      game?.numberOfDevices > 1 &&
      permissionModalVisible === false
    ) {
      initiateCall();
      setDisplayVideo(true);
    }
    return async () => {
      twillio.current = null;
    };
  }, [game?.numberOfDevices, permissionModalVisible]);

  console.log("current", twillio.current);

  return (
    <TwillioContext.Provider
      value={[twillio?.current, existingTracksIds, connected]}
    >
      {children}
      <PermissionsModal
        open={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
      />
    </TwillioContext.Provider>
  );
};

export default TwillioWrapper;
