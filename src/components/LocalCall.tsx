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

const LocalCall: React.FC = () => {
  const classes = useStyles();
  const { jitsy } = useContext(JitsyContext);
  const [attached, setAttached] = useState<boolean>(false);

  const attachJitsyToComponent = () => {
    if (jitsy) {
      try {
        jitsy.attachLocalTrackToComponent("local-jitsi");
        setAttached(true);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  useEffect(() => {
    attachJitsyToComponent();
  }, []);

  useInterval(() => attachJitsyToComponent(), attached ? null : 1000);

  return (
    <Box
      id="local-jitsi"
      className={classes.container}
      minWidth="200px"
      minHeight="110px"
      style={{ backgroundColor: "black" }}
    >
      <video autoPlay></video>
    </Box>
  );
};

export default LocalCall;
