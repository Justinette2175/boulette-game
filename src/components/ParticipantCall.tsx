import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { User } from "../types";
import Jitsy from "../services/jitsy";

interface IProps {
  jitsyId: string;
  j: Jitsy;
}
const ParticipantCall: React.FC<IProps> = ({ jitsyId, j }) => {
  useEffect(() => {
    try {
      j.attachRemoteTrackToComponent(jitsyId, `${jitsyId}-jitsi`);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  return (
    <Box id={`${jitsyId}-jitsi`}>
      <video autoPlay></video>
      <audio autoPlay></audio>
    </Box>
  );
};

export default ParticipantCall;
