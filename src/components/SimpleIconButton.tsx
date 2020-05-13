import React from "react";

import { IconButton, IconButtonProps } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => {
  return createStyles({
    button: {
      padding: 0,
      backgroundColor: "transparent",
      "& svg": {
        transition: ".25s",
        stroke: (props: IProps) => props.overrideColor,
      },
      "&:hover": {
        backgroundColor: "transparent",
        "& svg": {
          stroke: (props: IProps) => props.hoverColor,
        },
      },
    },
  });
});

interface IProps extends IconButtonProps {
  overrideColor?: String;
  hoverColor?: String;
}

const SimpleIconButton: React.FC<IProps> = ({
  children,
  overrideColor,
  hoverColor,
  ...rest
}) => {
  const classes = useStyles({ overrideColor, hoverColor });
  return (
    <IconButton classes={{ root: classes.button }} {...rest}>
      {children}
    </IconButton>
  );
};

export default SimpleIconButton;
