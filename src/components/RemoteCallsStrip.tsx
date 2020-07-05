import React, { useContext, useEffect } from "react";
import { Box, Grid } from "@material-ui/core";
import RemoteCall from "./RemoteCall";
import { useGamePlayers, useGameDevices } from "../hooks";
import DeviceIdContext from "../contexts/DeviceIdContext";
import TwillioContext from "../contexts/TwillioContext";

interface IProps {}

const RemoteCallsStrip: React.FC<IProps> = () => {
  const deviceId = useContext(DeviceIdContext);
  const [_, existingTracks] = useContext(TwillioContext);

  const localDeviceTrack = existingTracks[deviceId];

  return (
    <Box overflow="auto" width="100%" style={{ backgroundColor: "black" }}>
      <Grid container spacing={0} wrap="nowrap">
        {localDeviceTrack && (
          <Grid item>
            <RemoteCall local sid={localDeviceTrack.sid} />
          </Grid>
        )}

        {Object.keys(existingTracks).map((id) => {
          if (id !== deviceId && existingTracks[id].exists) {
            return (
              <Grid item>
                <RemoteCall sid={existingTracks[id].sid} />
              </Grid>
            );
          } else return null;
        })}
      </Grid>
    </Box>
  );
};

export default RemoteCallsStrip;
