import React, { useEffect, useState, useRef, useContext } from "react";
import JitsiContext from "../../contexts/JitsiContext";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import { FirebaseContext } from "../../firebase";
import Jitsy from "../../services/jitsy";

import { useGameRef } from "../../hooks";
import GameContext from "../../contexts/GameContext";
import {
  MutedState,
  FirebaseGameDevice,
  JitsiTracks,
} from "../../types/firebaseTypes";

interface IProps {}

export const JitsiWrapper: React.FC<IProps> = ({ children }) => {
  const game = useContext(GameContext);
  const jitsi = useRef<Jitsy>(null);
  const gameRef = useGameRef();
  const deviceId = useContext(DeviceIdContext);
  const firebase = useContext(FirebaseContext);
  const [existingTracksIds, setExistingTracksIds] = useState<JitsiTracks>({});
  const [permissionModalVisible, setPermissionModalVisible] = useState<boolean>(
    false
  );
  const [muted, setMuted] = useState<MutedState>({
    audio: false,
    video: false,
  });
  const [jitsiIdForDevice, setJitsiIdForDevice] = useState<string>(null);

  const setJitsiId = async (jitsiId: string) => {
    if (deviceId) {
      const updatedDevice: FirebaseGameDevice = {
        jitsiId,
      };
      await gameRef.collection("devices").doc(deviceId).set(updatedDevice);
      setJitsiIdForDevice(jitsiId);
    }
  };

  const updateTrackExistence = (id: string, exists: boolean) => {
    setExistingTracksIds((ex) => ({
      ...ex,
      [id]: { ...ex[id], exists: true },
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

  useEffect(() => {
    if (game?.id) {
      try {
        const j = new Jitsy(
          game.id,
          updateTrackExistence,
          () => setPermissionModalVisible(false),
          setJitsiId,
          updateMuteState
        );
        jitsi.current = j;
      } catch (e) {
        console.log("Error:JitsiContext:newJitsi", e);
      }
      return async () => {
        await jitsi?.current?.leave();
        jitsi.current = null;
      };
    }
  }, [game?.id]);

  return (
    <JitsiContext.Provider
      value={[
        jitsi?.current,
        existingTracksIds,
        jitsiIdForDevice,
        muted,
        setMuted,
      ]}
    >
      {children}
      {/* <PermissionsModal
        open={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
      /> */}
    </JitsiContext.Provider>
  );
};

export default JitsiWrapper;
