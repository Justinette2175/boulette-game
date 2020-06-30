import React, { useEffect, useContext, useState } from "react";
import useInterval from "../utils/useInterval";
import { Box } from "@material-ui/core";

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
        console.log("The remote component was attached for ", jitsiId);
        setAttached(true);
      } catch (e) {
        console.warn(e.message);
      }
    }
  };

  useEffect(() => {
    attachJitsyToComponent();
  }, []);

  useEffect(() => {
    console.log("updating effect for track exists");
    setAttached(false);
    attachJitsyToComponent();
  }, [trackExists]);

  useInterval(() => attachJitsyToComponent(), attached ? null : 1000);

  return (
    <Box
      id={`${jitsiId}-jitsi`}
      className={classes.container}
      minWidth={!audioOnly ? "200px" : "0"}
      minHeight={!audioOnly ? "110px" : "0"}
      style={{ backgroundColor: "black" }}
    >
      {!audioOnly && <video autoPlay></video>}
      <audio autoPlay></audio>
    </Box>
  );
};

export default RemoteCall;
