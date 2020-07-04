import React, { useEffect, useContext, useState } from "react";

import { Box } from "@material-ui/core";
import useCurrentPlayerIsOnDevice from "../../hooks/useCurrentPlayerIsOnDevice";
import JitsiContext from "../../contexts/JitsiContext";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import { useGameRef } from "../../hooks";

const RETRY_INTERVAL = 1000;

const CurrentPlayerVideo = () => {
  const round = useContext(CurrentRoundContext);
  const currentPlayer = round?.currentPlayer;
  const gameRef = useGameRef();
  const [attached, setAttached] = useState<boolean>(false);
  const [currentPlayerJitsiId, setCurrentPlayerJitsiId] = useState<string>(
    null
  );

  const [jitsi, existingTracksIds] = useContext(JitsiContext);

  const trackExists =
    currentPlayerJitsiId && existingTracksIds[currentPlayerJitsiId];

  const listenToCurrentPlayerJitsiId = () => {
    try {
      if (!currentPlayer.deviceId) {
        throw new Error("Current player has no device Id");
      }
      return gameRef
        .collection("devices")
        .doc(currentPlayer.deviceId)
        .onSnapshot((doc: any) => {
          if (doc.exists) {
            const { jitsiId } = doc.data();
            setCurrentPlayerJitsiId(jitsiId);
          }
        });
    } catch (e) {
      console.log("Error:CurrentPlayerVideo:getPlayerDevice", e);
    }
  };

  const attachTrack = () => {
    if (
      jitsi &&
      currentPlayerJitsiId &&
      existingTracksIds[currentPlayerJitsiId]
    ) {
      try {
        jitsi.attachRemoteTrackToComponent(
          currentPlayerJitsiId,
          "current-player-jitsi"
        );
        setAttached(true);
      } catch (e) {
        console.log("Error:CurrentPlayerVideo:attachTrack:", e);
      }
    }
  };

  useEffect(() => {
    if (currentPlayer) {
      setAttached(false);
      const unsubscribeToJitsiId = listenToCurrentPlayerJitsiId();
      return unsubscribeToJitsiId;
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (currentPlayerJitsiId && trackExists) {
      attachTrack();
    } else {
      setAttached(false);
    }
  }, [currentPlayerJitsiId, trackExists]);

  return (
    <Box id="current-player-jitsi" width="100%">
      <video
        autoPlay
        style={{ width: "100%", height: "auto", maxHeight: "500px" }}
      ></video>
      <audio autoPlay></audio>
    </Box>
  );
};

export default CurrentPlayerVideo;
