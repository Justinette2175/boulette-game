import React from "react";
import { Box, Typography } from "@material-ui/core";
import { User } from "../types";
import { User as UserIcon } from "react-feather";

interface IProps {
  usersOnThatJitsi?: Array<User>;
  showNames?: boolean;
}

const CallWrapper: React.FC<IProps> = ({
  usersOnThatJitsi,
  children,
  showNames = true,
}) => {
  return (
    <Box width="200px">
      {children}
      <Box display="flex" width="100%" justifyContent="space-between" mt={1}>
        <Box mr={1}>
          {showNames &&
            usersOnThatJitsi.map((u: User) => (
              <Box>
                <Typography component="span" variant="body1">
                  {u.name}
                </Typography>
              </Box>
            ))}
        </Box>
        <Box display="flex">
          <Typography component="span" variant="body1">
            {usersOnThatJitsi.length}
          </Typography>
          <UserIcon size={20} />
        </Box>
      </Box>
    </Box>
  );
};

export default CallWrapper;
