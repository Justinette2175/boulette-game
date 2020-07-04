import React, { useEffect, useContext, useState } from "react";
import useInterval from "../utils/useInterval";
import { Box, IconButton } from "@material-ui/core";
import { Mic, MicOff, Video, VideoOff } from "react-feather";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import JitsiContext from "../contexts/JitsiContext";
import { MutedState } from "../types/firebaseTypes";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      width: "200px",
      display: "flex",
      alignItems: "flex-end",
      "& video": {
        width: "100%",
      },
    },
    iconButton: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.primary,
      marginLeft: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
  });
});

const LocalCall: React.FC = () => {
  const classes = useStyles();
  const [jitsi, _1, _2, muted, setMuted] = useContext(JitsiContext);
  const [attached, setAttached] = useState<boolean>(false);

  const attachJitsyToComponent = () => {
    if (jitsi) {
      try {
        jitsi.attachLocalTrackToComponent("local-jitsi");
        setAttached(true);
      } catch (e) {
        // console.warn(e);
      }
    }
  };

  const toggleMute = async (type: "audio" | "video") => {
    if (jitsi) {
      try {
        await jitsi.toggleMute([type]);
        setMuted((prev: MutedState) => ({ ...prev, [type]: !prev[type] }));
      } catch (e) {
        console.warn(e.message);
      }
    }
  };

  useEffect(() => {
    attachJitsyToComponent();
  }, []);

  useInterval(() => attachJitsyToComponent(), attached ? null : 1000);

  return (
    <Box position="relative">
      <Box
        id="local-jitsi"
        className={classes.container}
        minWidth="200px"
        minHeight="110px"
        style={{ backgroundColor: "black" }}
      >
        <video
          style={{ width: "100%", height: "auto", maxHeight: "112px" }}
          autoPlay
        ></video>
      </Box>
      <Box
        position="absolute"
        borderColor="secondary.main"
        border={3}
        style={{ bottom: 0, left: 0, right: 0, top: 0 }}
      ></Box>
      <Box position="absolute" style={{ bottom: 0, left: 0 }}>
        <IconButton
          color="primary"
          size="small"
          classes={{ root: classes.iconButton }}
          onClick={() => toggleMute("audio")}
        >
          {muted.audio ? <MicOff size={20} /> : <Mic size={20} />}
        </IconButton>
        <IconButton
          color="primary"
          size="small"
          onClick={() => toggleMute("video")}
          classes={{ root: classes.iconButton }}
        >
          {muted.video ? <VideoOff size={20} /> : <Video size={20} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default LocalCall;
