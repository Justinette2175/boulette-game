import React from "react";
import { Box, Typography } from "@material-ui/core";
import UserAvatar from "./UserAvatar";

interface IProps {
  name?: string;
}

const PlayerAndAvatar: React.FC<IProps> = ({ name }) => {
  return (
    <Box display="flex" flexDirection="column" maxWidth="100px">
      {name && <Typography>{name}</Typography>}
      <UserAvatar mt={0.5} />
    </Box>
  );
};

export default PlayerAndAvatar;
