import React, { useContext } from "react";
import GameContext from "../contexts/GameContext";
import DeviceIdContext from "../contexts/DeviceIdContext";

const useOwnerIsOnDevice = (): boolean => {
  const game = useContext(GameContext);
  const deviceId = useContext(DeviceIdContext);
  return game?.owner?.deviceId === deviceId || false;
};

export default useOwnerIsOnDevice;
