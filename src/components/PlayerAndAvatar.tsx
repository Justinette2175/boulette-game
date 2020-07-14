import React from "react";
import { Box, Typography } from "@material-ui/core";
import UserAvatar from "./UserAvatar";

interface IProps {
  name?: string;
}

const PlayerAndAvatar: React.FC<IProps> = ({ name }) => {
  return (
    <Box display="flex" alignItems="center">
      {/* <UserAvatar mr={1} /> */}
      <Box
        borderRadius={20}
        bgcolor="primary.dark"
        width="15px"
        height="15px"
        mr={2}
      ></Box>
      {name && <Typography style={{ marginBottom: 0 }}>{name}</Typography>}
    </Box>
  );
};

export default PlayerAndAvatar;
