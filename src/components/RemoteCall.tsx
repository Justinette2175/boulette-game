import React, { useEffect, useContext, useState } from "react";
import JitsyContext from "../utils/JitsiContext";
import useInterval from "../utils/useInterval";
import { Box } from "@material-ui/core";

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

interface IProps {
  jitsiId: string;
  audioOnly?: boolean;
}

const RemoteCall: React.FC<IProps> = ({ jitsiId, audioOnly }) => {
  const classes = useStyles();
  const { jitsy } = useContext(JitsyContext);
  const [attached, setAttached] = useState<boolean>(false);

  const attachJitsyToComponent = () => {
    if (jitsy && jitsiId) {
      try {
        jitsy.attachRemoteTrackToComponent(jitsiId, `${jitsiId}-jitsi`);
        setAttached(true);
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
