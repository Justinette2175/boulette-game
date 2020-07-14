import React from "react";

import { Button as MuiButton, ButtonProps } from "@material-ui/core";

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <MuiButton {...rest}>{children}</MuiButton>;
};

export default Button;
