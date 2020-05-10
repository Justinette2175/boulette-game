import React, { useEffect, useContext, useState } from "react";
import JitsyContext from "../../utils/JitsiContext";

import { Box } from "@material-ui/core";
import useCurrentPlayerIsOnDevice from "../../utils/useCurrentPlayerIsOnDevice";
import useCurrentUser from "../../utils/useCurrentUser";
import useInterval from "../../utils/useInterval";

import { VIDEO_HEIGHT } from "../../constants";

const RETRY_INTERVAL = 1000;

const CurrentPlayerVideo = () => {
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  const currentUser = useCurrentUser();
  const [videoIsAttached, setVideoIsAttached] = useState<boolean>(false);

  const { jitsy, existingTracksIds } = useContext(JitsyContext);

  const attachTrack = () => {
    console.log("user", currentUser ? currentUser.jitsyId : "No user");
    console.log("track", existingTracksIds);
    if (
      jitsy &&
      currentUser &&
      currentUser.jitsyId &&
      existingTracksIds.indexOf(currentUser.jitsyId) > -1
    ) {
      try {
        jitsy.attachRemoteTrackToComponent(
          currentUser.jitsyId,
          "current-player-jitsi"
        );
        setVideoIsAttached(true);
      } catch (e) {
        console.warn(e);
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
