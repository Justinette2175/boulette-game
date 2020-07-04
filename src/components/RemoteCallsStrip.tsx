import React, { useContext } from "react";
import { Box, Grid } from "@material-ui/core";
import RemoteCall from "./RemoteCall";
import { useGamePlayers, useGameDevices } from "../hooks";
import DeviceIdContext from "../contexts/DeviceIdContext";
import LocalCall from "./LocalCall";

interface IProps {
  includeLocal?: boolean;
  includeNames?: boolean;
  audioOnly?: boolean;
}

const RemoteCallsStrip: React.FC<IProps> = ({
  includeLocal,
  includeNames = true,
  audioOnly,
}) => {
  const deviceId = useContext(DeviceIdContext);
  const devices = useGameDevices();

  const playersByJitsiId = devices.filter(
    (device) => !!device.jitsiId && device.id !== deviceId
  );

  return (
    <Box overflow="auto" width="100%" style={{ backgroundColor: "black" }}>
      <Grid container spacing={0} wrap="nowrap">
        <Grid item>
          <LocalCall />
        </Grid>
        {playersByJitsiId.map((device) => {
          return (
            <Grid item>
              <RemoteCall jitsiId={device.jitsiId} audioOnly={audioOnly} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RemoteCallsStrip;
