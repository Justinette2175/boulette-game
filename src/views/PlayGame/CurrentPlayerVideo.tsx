import React, { useEffect, useContext } from "react";

import { Box } from "@material-ui/core";
import TwillioContext from "../../contexts/TwillioContext";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    videoWrapper: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      backgroundColor: "black",
      "& video": {
        width: "100%",
        maxWidth: "100%",
      },
    },
  });
});

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

  const classes = useStyles();

  useEffect(() => {
    if (connected && currentPlayerSid) {
      attachCallToComponent(currentPlayerSid);
    }
  }, [connected, currentPlayerSid]);

  return <Box className={classes.videoWrapper} id="current-player"></Box>;
};

export default CurrentPlayerVideo;
