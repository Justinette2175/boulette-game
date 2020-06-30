import React from "react";
import { Box, BoxProps, useTheme } from "@material-ui/core";

const UserAvatar: React.FC<BoxProps> = (props) => {
  return (
    <Box
      height="30px"
      width="30px"
      border={1}
      borderRadius="100%"
      {...props}
    ></Box>
  );
};

export default UserAvatar;
