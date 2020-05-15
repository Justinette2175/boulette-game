import React from "react";
import { Box, Grid } from "@material-ui/core";
import { Store } from "../types";
import { useSelector } from "react-redux";
import RemoteCall from "./RemoteCall";
import CallWrapper from "./CallWrapper";
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
      <Grid container spacing={1}>
        {includeLocal && (
          <Grid item>
            <LocalCall />
          </Grid>
        )}
        {Object.keys(usersByJitsiId).map((key: string) => {
          const usersOnThatJitsi = usersByJitsiId[key];
          return (
            <Grid item>
              {includeNames ? (
                <CallWrapper usersOnThatJitsi={usersOnThatJitsi}>
                  <RemoteCall jitsiId={key} audioOnly={audioOnly} />
                </CallWrapper>
              ) : (
                <RemoteCall jitsiId={key} audioOnly={audioOnly} />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RemoteCallsStrip;
