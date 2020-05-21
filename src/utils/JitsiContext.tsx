import React, { createContext, useEffect, useState } from "react";
import Jitsy from "../services/jitsy";
import GameService from "../services/game";

const JitsiContext = createContext(null);

interface IProps {
  gameId: string;
}

interface TrackIds {
  [key: string]: boolean;
}

export const JitsiProvider: React.FC<IProps> = ({ gameId, children }) => {
  const [existingTracksIds, setExistingTracksIds] = useState<TrackIds>({});
  const [hasLocalVideo, setHasLocalVideo] = useState<boolean>(false);

  const addExistingTrackId = (id: string) => {
    const newTracks = { ...existingTracksIds, [id]: true };
    setExistingTracksIds(newTracks);
  };

  const removeExistingTrackId = (id: string) => {
    console.log("removing track id");
    let exists = existingTracksIds[id];
    if (exists) {
      const newTracks = { ...existingTracksIds, [id]: false };
      setExistingTracksIds(newTracks);
    }
  };

  useEffect(() => {
    if (gameId) {
      const j = new Jitsy(
        gameId,
        addExistingTrackId,
        removeExistingTrackId,
        setHasLocalVideo
      );
      GameService.setJitsi(j);
    }
  }, [gameId]);

  return (
    <JitsiContext.Provider value={{ existingTracksIds, hasLocalVideo }}>
      {children}
    </JitsiContext.Provider>
  );
};

export default JitsiContext;
