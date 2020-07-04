import React, { useEffect, useContext, useState } from "react";
import useInterval from "../utils/useInterval";
import { Box, Typography } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import JitsiContext from "../contexts/JitsiContext";

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

interface IProps {
  jitsiId: string;
  audioOnly?: boolean;
}

const RemoteCall: React.FC<IProps> = ({ audioOnly, jitsiId }) => {
  const classes = useStyles();
  const [jitsi, existingTracksIds] = useContext(JitsiContext);
  const [attached, setAttached] = useState<boolean>(false);

  const trackExists = existingTracksIds[jitsiId];

  const attachJitsyToComponent = () => {
    if (jitsi && jitsiId) {
      try {
        jitsi.attachRemoteTrackToComponent(jitsiId, `${jitsiId}-jitsi`);
        setAttached(true);
      } catch (e) {
        console.log("Error:RemoteCall:attchJitsiToComponent", e);
      }
    }
  };

  useEffect(() => {
    if (!trackExists) {
      setAttached(false);
    } else {
      attachJitsyToComponent();
    }
  }, [trackExists]);

  return (
    <Box
      id={`${jitsiId}-jitsi`}
      position="relative"
      className={classes.container}
      minWidth={!audioOnly ? "200px" : "0"}
      minHeight={!audioOnly ? "110px" : "0"}
      style={{ backgroundColor: "black" }}
    >
      <Box
        position="absolute"
        style={{ top: 0, right: 0, left: 0 }}
        bgcolor="secondary.light"
        p={1}
      >
        <Typography align="center">
          {trackExists ? "true" : "false "}
        </Typography>
      </Box>

      {!audioOnly && (
        <video
          style={{ width: "100%", height: "auto", maxHeight: "112px" }}
          autoPlay
        ></video>
      )}
      <audio autoPlay></audio>
    </Box>
  );
};

export default RemoteCall;
