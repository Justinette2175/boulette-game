import React, { useEffect, useContext } from "react";
import TwillioContext from "../contexts/TwillioContext";
import { Box } from "@material-ui/core";

interface IProps {
  jitsyId: string;
}
const ParticipantCall: React.FC<IProps> = ({ jitsyId }) => {
  const [twillio, existingTracksIds] = useContext(TwillioContext);
  useEffect(() => {
    try {
      // twillio.attachRemoteTrackToComponent(jitsyId, `${jitsyId}-jitsi`);
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
