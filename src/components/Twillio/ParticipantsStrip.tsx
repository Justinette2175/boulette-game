import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import Participant from "./Participant";
import TwillioContext from "../../contexts/TwillioContext";

interface IProps {
  direction: "row" | "column";
}

const ParticipantsStrip: React.FC<IProps> = ({ direction }) => {
  const [room, participants] = useContext(TwillioContext);

  return (
    <Box display="flex" flexDirection={direction} flexWrap="nowrap">
      {room && (
        <>
          {room.localParticipant && (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              local
            />
          )}

          {participants.map((p: any) => (
            <Participant key={p.sid} participant={p} />
          ))}
        </>
      )}
    </Box>
  );
};

export default ParticipantsStrip;
