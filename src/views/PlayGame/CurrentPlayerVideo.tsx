import React, { useEffect, useContext } from "react";

import { Box } from "@material-ui/core";
import TwillioContext from "../../contexts/TwillioContext";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";

const CurrentPlayerVideo = () => {
  const round = useContext(CurrentRoundContext);
  const currentPlayer = round?.currentPlayer;
  const [twillio, existingTracks, connected] = useContext(TwillioContext);
  const currentPlayerSid = existingTracks[currentPlayer?.deviceId]?.sid;

  const attachCallToComponent = (sid: string) => {
    if (twillio && sid) {
      try {
        twillio.attachParticipantMedia(sid, "current-player");
      } catch (e) {
        console.log("Error:CurrentPlayerVideo:attachCallToComponent", e);
      }
    }
  };

  useEffect(() => {
    if (connected && currentPlayerSid) {
      attachCallToComponent(currentPlayerSid);
    }
  }, [connected, currentPlayerSid]);

  return <Box id="current-player" width="100%"></Box>;
};

export default CurrentPlayerVideo;
