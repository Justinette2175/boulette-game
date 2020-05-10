import React, { createContext, useEffect, useState } from "react";
import Jitsy from "../services/jitsy";

const JitsiContext = createContext(null);

interface IProps {
  gameId: string;
}

export const JitsiProvider: React.FC<IProps> = ({ gameId, children }) => {
  const [jitsy, setJitsy] = useState<Jitsy>();
  const [existingTracksIds, setExistingTracksIds] = useState<Array<string>>([]);
  const [hasLocalVideo, setHasLocalVideo] = useState<boolean>(false);

  const addExistingTrackId = (id: string) => {
    const newTracks = [...existingTracksIds, id];
    setExistingTracksIds(newTracks);
  };

  useEffect(() => {
    if (gameId) {
      const j = new Jitsy(gameId, addExistingTrackId, setHasLocalVideo);
      setJitsy(j);
    }
  }, [gameId]);

  return (
    <JitsiContext.Provider value={{ jitsy, existingTracksIds }}>
      {children}
    </JitsiContext.Provider>
  );
};

export default JitsiContext;
