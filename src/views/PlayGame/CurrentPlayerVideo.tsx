import React, { useState, useEffect, useContext } from "react";

import TwillioContext from "../../contexts/TwillioContext";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";

import Participant from "../../components/Twillio/Participant";

const CurrentPlayerVideo = (): any => {
  const round = useContext(CurrentRoundContext);
  const currentPlayer = round?.currentPlayer;
  const [_, participants] = useContext(TwillioContext);
  const [participant, setParticipant] = useState<any>(null);

  useEffect(() => {
    if (currentPlayer && participants.length > 0) {
      const activeParticipant = participants.find(
        (p: any) => p.identity === currentPlayer.deviceId
      );
      setParticipant(activeParticipant);
    } else {
      setParticipant(null);
    }
  }, [currentPlayer, participants]);

  return <Participant participant={participant} large />;
};

export default CurrentPlayerVideo;
