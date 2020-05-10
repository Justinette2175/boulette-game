import React from "react";
import { Box, Grid } from "@material-ui/core";
import { Store, TeamId } from "../types";
import { useSelector } from "react-redux";
import RemoteCall from "./RemoteCall";
import CallWrapper from "./CallWrapper";

interface IProps {
  teamId?: TeamId;
}

const RemoteCallsStrip: React.FC<IProps> = ({ teamId }) => {
  const gameUsers = useSelector((state: Store) => state.game.users);
  const computerUsers = useSelector((state: Store) => state.computer.users);

  const usersByJitsiId = gameUsers
    .filter((us) => computerUsers.indexOf(us.id) < 0)
    .filter((user) => !!user.jitsyId)
    .reduce((acc: any, u) => {
      if (u.jitsyId && acc[u.jitsyId]) {
        acc[u.jitsyId].push(u);
      } else if (u.jitsyId) {
        acc[u.jitsyId] = [u];
      }
      return acc;
    }, {});

  return (
    <Box width="100%">
      <Grid container spacing={2}>
        {Object.keys(usersByJitsiId).map((key: string) => {
          const usersOnThatJitsi = usersByJitsiId[key];
          return (
            <Grid item>
              <CallWrapper usersOnThatJitsi={usersOnThatJitsi}>
                <RemoteCall jitsiId={key} />
              </CallWrapper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RemoteCallsStrip;
