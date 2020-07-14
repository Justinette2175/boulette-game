import React, { useContext, useEffect } from "react";
import { Box, Grid } from "@material-ui/core";
import RemoteCall from "./RemoteCall";
import DeviceIdContext from "../contexts/DeviceIdContext";
import TwillioContext from "../contexts/TwillioContext";

interface IProps {
  direction: "row" | "column";
}

const RemoteCallsStrip: React.FC<IProps> = ({ direction }) => {
  const deviceId = useContext(DeviceIdContext);
  const [_, existingTracks] = useContext(TwillioContext);

  const localDeviceTrack = existingTracks[deviceId];

  return (
    <Box display="flex" flexDirection={direction} flexWrap="nowrap">
      {localDeviceTrack && <RemoteCall local track={localDeviceTrack} />}

      {Object.keys(existingTracks).map((id) => {
        if (id !== deviceId && existingTracks[id].exists) {
          return <RemoteCall track={existingTracks[id]} />;
        } else return null;
      })}
    </Box>
  );
};

export default RemoteCallsStrip;
