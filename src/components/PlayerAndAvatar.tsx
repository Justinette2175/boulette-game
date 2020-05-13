import React from "react";
import { Box, Typography } from "@material-ui/core";
import UserAvatar from "./UserAvatar";

interface IProps {
  name?: string;
}

const PlayerAndAvatar: React.FC<IProps> = ({ name }) => {
  return (
    <Box display="flex" flexDirection="column">
      {name && <Typography>{name}</Typography>}
      <UserAvatar my={1} />
    </Box>
  );
};

export default PlayerAndAvatar;
