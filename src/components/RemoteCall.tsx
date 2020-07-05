import React, { useEffect, useContext, useState } from "react";
import useInterval from "../utils/useInterval";
import { Box, Typography } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TwillioContext from "../contexts/TwillioContext";

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
  sid: string;
  local?: boolean;
}

const RemoteCall: React.FC<IProps> = ({ sid, local }) => {
  const classes = useStyles();
  const [twillio, _, connected] = useContext(TwillioContext);
  const [attached, setAttached] = useState<boolean>(false);

  const attachJitsyToComponent = () => {
    if (twillio && sid) {
      try {
        twillio.attachParticipantMedia(sid, `call-${sid}`, !!local);
        setAttached(true);
      } catch (e) {
        console.log("Error:RemoteCall:attchJitsiToComponent", e);
      }
    }
  };

  useEffect(() => {
    if (connected && sid) {
      attachJitsyToComponent();
    }
  }, [connected, sid]);

  return (
    <Box
      id={`call-${sid}`}
      position="relative"
      className={classes.container}
      minWidth="200px"
      minHeight="110px"
      style={{ backgroundColor: "black" }}
    >
      {/* {!audioOnly && (
        <video
          style={{ width: "100%", height: "auto", maxHeight: "112px" }}
          autoPlay
        ></video>
      )}
      <audio autoPlay></audio> */}
    </Box>
  );
};

export default RemoteCall;
