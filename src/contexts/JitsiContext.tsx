import React, { createContext, useEffect, useState } from "react";
import Jitsy from "../services/jitsy";

import PermissionsModal from "../components/PermissionsModal";

interface TrackIds {
  [key: string]: boolean;
}

const JitsiContext = createContext<[Jitsy, TrackIds]>(null);

interface IProps {
  gameId: string;
}

export const JitsiProvider: React.FC<IProps> = ({ gameId, children }) => {
  const [existingTracksIds, setExistingTracksIds] = useState<TrackIds>({});
  const [jitsiInstance, setJitsiInstance] = useState<Jitsy>(null);
  const [permissionModalVisible, setPermissionModalVisible] = useState<boolean>(
    false
  );

  const setJitsiId = (jitsiId: string) => {
    // save jitsiId to firebase
  };

  const addExistingTrackId = (id: string) => {
    setExistingTracksIds((ex) => ({ ...ex, [id]: true }));
  };

  const removeExistingTrackId = (id: string) => {
    let exists = existingTracksIds[id];
    if (exists) {
      setExistingTracksIds((ex) => ({ ...ex, [id]: false }));
    }
  };

  useEffect(() => {
    if (gameId) {
      try {
        const j = new Jitsy(
          gameId,
          addExistingTrackId,
          removeExistingTrackId,
          () => setPermissionModalVisible(false),
          setJitsiId
        );
        setJitsiInstance(j);
      } catch (e) {
        console.log("Error:JitsiContext:newJitsi", e);
      }
    }
  }, [gameId]);

  return (
    <JitsiContext.Provider value={[jitsiInstance, existingTracksIds]}>
      {children}
      <PermissionsModal
        open={permissionModalVisible}
        onClose={() => setPermissionModalVisible(false)}
      />
    </JitsiContext.Provider>
  );
};

export default JitsiContext;
