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
    const participantWrapper = document.getElementById(`${jitsyId}-jitsi`);
    console.log("particiopant wrapper", participantWrapper);
    console.log("In the useEffect block");
    console.log("attaching");
    j.attachRemoteTrackToComponent(jitsyId);
  }, []);

  return (
    <Box>
      <Box id={`${jitsyId}-jitsi`}>
        <video autoPlay></video>
        <audio autoPlay></audio>
      </Box>
    </Box>
  );
};

export default ParticipantCall;
