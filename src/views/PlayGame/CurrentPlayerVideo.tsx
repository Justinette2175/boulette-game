import React, { useEffect, useContext, useState } from "react";
import GameService from "../../services/game";
import JitsyContext from "../../utils/JitsiContext";

import { Box } from "@material-ui/core";
import useCurrentPlayerIsOnDevice from "../../hooks/useCurrentPlayerIsOnDevice";
import useCurrentUser from "../../utils/useCurrentUser";
import useInterval from "../../utils/useInterval";

const RETRY_INTERVAL = 1000;

const CurrentPlayerVideo = () => {
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  const currentUser = useCurrentUser();
  const [videoIsAttached, setVideoIsAttached] = useState<boolean>(false);

  const { existingTracksIds } = useContext(JitsyContext);
  const jitsi = GameService.getJitsi();

  const attachTrack = () => {
    if (
      jitsi &&
      currentUser &&
      currentUser.jitsyId &&
      existingTracksIds[currentUser.jitsyId]
    ) {
      try {
        jitsi.attachRemoteTrackToComponent(
          currentUser.jitsyId,
          "current-player-jitsi"
        );
        setVideoIsAttached(true);
      } catch (e) {
        console.warn(e.message);
      }
    }
  };

  useEffect(() => {
    if (!currentPlayerIsOnDevice) {
      console.log("Effect calling for current player video");
      setVideoIsAttached(false);
      attachTrack();
    }
  }, [currentUser]);

  useInterval(
    () => {
      if (!currentPlayerIsOnDevice) {
        console.log("in interval attaching");
        attachTrack();
      }
    },
    videoIsAttached ? null : RETRY_INTERVAL
  );

  return (
    <Box id="current-player-jitsi" width="100%">
      <video autoPlay style={{ width: "100%" }}></video>
      <audio autoPlay></audio>
    </Box>
  );
};

export default CurrentPlayerVideo;
