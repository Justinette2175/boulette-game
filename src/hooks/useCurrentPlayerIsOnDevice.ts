import React, { useContext } from "react";
import GameContext from "../contexts/GameContext";
import DeviceIdContext from "../contexts/DeviceIdContext";

const useCurrentPlayerIsOnDevice = (): boolean => {
  const game = useContext(GameContext);
  const deviceId = useContext(DeviceIdContext);
  return game?.currentPlayer?.deviceId === deviceId || false;
};

export default useCurrentPlayerIsOnDevice;
