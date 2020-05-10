import React from "react";
import { Box, BoxProps } from "@material-ui/core";

const UserAvatar: React.FC<BoxProps> = (props) => {
  return (
    <Box height="60px" width="60px" border="1px solid black" {...props}></Box>
  );
};

export default UserAvatar;
