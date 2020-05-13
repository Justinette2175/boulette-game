import React from "react";
import { Box, BoxProps, useTheme } from "@material-ui/core";

const UserAvatar: React.FC<BoxProps> = (props) => {
  const theme = useTheme();
  return (
    <Box
      height="60px"
      width="60px"
      border="1px solid black"
      borderRadius={theme.shape.borderRadius}
      {...props}
    ></Box>
  );
};

export default UserAvatar;
