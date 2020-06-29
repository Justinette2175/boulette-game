import React, { useContext } from "react";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import DeviceIdContext from "../contexts/DeviceIdContext";

const useCurrentPlayerIsOnDevice = (): boolean => {
  const round = useContext(CurrentRoundContext);
  const deviceId = useContext(DeviceIdContext);
  return round?.currentPlayer?.deviceId === deviceId || false;
};

export default useCurrentPlayerIsOnDevice;
