import React, { useEffect, useContext, useState } from "react";
import { Box } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TwillioContext from "../contexts/TwillioContext";
import { VideoTrack } from "../types/firebaseTypes";
import { Mic, MicOff, Video, VideoOff } from "react-feather";
import { RoundButton } from "../components/Buttons";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    container: {
      height: "110px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "black",
      [theme.breakpoints.up("md")]: {
        height: "120px",
      },
      "& video": {
        maxHeight: "100%",
        maxWidth: "200px",
      },
    },
  });
});

interface IProps {
  track: VideoTrack;
  local?: boolean;
}

const RemoteCall: React.FC<IProps> = ({ track, local }) => {
  const classes = useStyles();
  const [twillio, _, connected] = useContext(TwillioContext);
  const [attached, setAttached] = useState<boolean>(false);

  const sid = track?.sid || null;
  const videoOn = track?.on?.video || null;

  const attachJitsyToComponent = () => {
    if (twillio && sid) {
      try {
        twillio.attachParticipantMedia(track.sid, `call-${sid}`, !!local);
        setAttached(true);
      } catch (e) {
        console.log("Error:RemoteCall:attchJitsiToComponent", e);
      }
    }
  };

  useEffect(() => {
    if (connected && sid && videoOn) {
      attachJitsyToComponent();
    }
  }, [connected, sid, videoOn]);

  return (
    <Box position="relative">
      <Box id={`call-${sid}`} className={classes.container}></Box>
      {local && (
        <Box position="absolute" p={0.5} style={{ bottom: 0, left: 0 }}>
          <RoundButton
            size="small"
            color="primary"
            onClick={() => twillio.toggleMute("audio", !track.on.audio)}
          >
            {track?.on?.audio ? <Mic size={25} /> : <MicOff size={25} />}
          </RoundButton>
          {/* <RoundButton
            size="small"
            color="primary"
            onClick={() => twillio.toggleMute("video", !track.on.audio)}
            style={{ marginLeft: "8px" }}
          >
            {track?.on?.video ? <Video size={25} /> : <VideoOff size={25} />}
          </RoundButton> */}
        </Box>
      )}
    </Box>
  );
};

export default RemoteCall;
