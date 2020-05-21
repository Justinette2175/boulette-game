import React, { useEffect, useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import JitsyContext from "../utils/JitsiContext";
import GameService from "../services/game";
import useInterval from "../utils/useInterval";
import { Box, IconButton } from "@material-ui/core";
import { Mic, MicOff, Video, VideoOff } from "react-feather";
import { Store } from "../types";
import { setAudioMuted, setVideoMuted } from "../redux/computer";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
  });
});

const LocalCall: React.FC = () => {
  const classes = useStyles();
  const jitsi = GameService.getJitsi();
  const [attached, setAttached] = useState<boolean>(false);
  const audioMuted = useSelector((state: Store) => state.computer.audioMuted);
  const videoMuted = useSelector((state: Store) => state.computer.videoMuted);
  const dispatch = useDispatch();

  const { hasLocalVideo } = useContext(JitsyContext);

  // console.log("jitsy in local is", jitsi);

  const attachJitsyToComponent = () => {
    if (jitsi) {
      console.log("Attaching jisti");
      try {
        jitsi.attachLocalTrackToComponent("local-jitsi");
        console.log("done attaching");
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
        console.log("muting now");
        if (type === "audio") {
          dispatch(setAudioMuted(!audioMuted));
        } else if (type === "video") {
          dispatch(setVideoMuted(!videoMuted));
        }
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
        <video autoPlay></video>
      </Box>
      <Box position="absolute" style={{ bottom: 0, left: 0 }}>
        <IconButton
          color="primary"
          size="small"
          onClick={() => toggleMute("audio")}
        >
          {audioMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </IconButton>
        <IconButton
          color="primary"
          size="small"
          onClick={() => toggleMute("video")}
        >
          {videoMuted ? <VideoOff size={20} /> : <Video size={20} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default LocalCall;
