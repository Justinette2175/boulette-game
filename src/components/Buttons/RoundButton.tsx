import React from "react";
import { IconButton, IconButtonProps } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface StyleProps {
  color: any;
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    roundButton: {
      backgroundColor: (props: StyleProps) => {
        return props.color === "primary"
          ? theme.palette.primary.main
          : theme.palette.secondary.main;
      },
      color: (props: StyleProps) => {
        return props.color === "primary"
          ? theme.palette.primary.contrastText
          : theme.palette.secondary.contrastText;
      },
      "&:hover": {
        backgroundColor: (props: StyleProps) => {
          return props.color === "primary"
            ? theme.palette.primary.dark
            : theme.palette.secondary.dark;
        },
      },
    },
  });
});

interface RoundButonProps extends IconButtonProps {}

const RoundButon: React.FC<RoundButonProps> = ({
  children,
  color,
  ...rest
}) => {
  const classes = useStyles({ color });
  return (
    <IconButton {...rest} classes={{ root: classes.roundButton }}>
      {children}
    </IconButton>
  );
};

export default RoundButon;
