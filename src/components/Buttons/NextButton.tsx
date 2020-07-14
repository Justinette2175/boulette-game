import React from "react";
import { Box, ButtonProps } from "@material-ui/core";
import Button from "./Button";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    buttonWrapper: {
      marginTop: theme.spacing(3),
      display: "flex",
      flexDirection: "column",

      [theme.breakpoints.down("xs")]: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing(1),
        zIndex: theme.zIndex.snackbar,
        justifyContent: "center",
      },
    },
  });
});

interface NextButtonProps {}

const NextButton: React.FC<NextButtonProps> = ({ children, ...rest }) => {
  const classes = useStyles();
  return <Box className={classes.buttonWrapper}>{children}</Box>;
};

export default NextButton;
