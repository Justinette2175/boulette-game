import React from "react";
import { Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    sidePaddingWrapper: {
      padding: `0 ${theme.spacing(2)}px`,
      [theme.breakpoints.up("sm")]: {
        padding: `0 ${theme.spacing(4)}px`,
      },
      [theme.breakpoints.up("md")]: {
        padding: `0 ${theme.spacing(6)}px`,
      },
      [theme.breakpoints.up("lg")]: {
        padding: `0 ${theme.spacing(8)}px`,
      },
    },
  });
});

interface SidePaddingWrapperProps {}

const SidePaddingWrapper: React.FC<SidePaddingWrapperProps> = ({
  children,
}) => {
  const classes = useStyles();
  return <Box className={classes.sidePaddingWrapper}>{children}</Box>;
};

export default SidePaddingWrapper;
