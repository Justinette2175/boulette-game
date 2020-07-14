import React from "react";
import { Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    viewWrapper: {
      padding: `${theme.spacing(6)}px ${theme.spacing(2)}px`,
      [theme.breakpoints.up("sm")]: {
        padding: `${theme.spacing(6)}px ${theme.spacing(4)}px`,
      },
      [theme.breakpoints.up("md")]: {
        padding: `${theme.spacing(6)}px ${theme.spacing(6)}px`,
      },
      [theme.breakpoints.up("lg")]: {
        padding: `${theme.spacing(6)}px ${theme.spacing(8)}px`,
      },
    },
  });
});

interface ViewWrapperProps {}

const ViewWrapper: React.FC<ViewWrapperProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <Box className={classes.viewWrapper} flexGrow={1}>
      {children}
    </Box>
  );
};

export default ViewWrapper;
