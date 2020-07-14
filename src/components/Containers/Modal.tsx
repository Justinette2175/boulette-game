import React from "react";

import { Box, Dialog, DialogProps } from "@material-ui/core";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    innerBox: {
      padding: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
      },
      [theme.breakpoints.up("md")]: {
        padding: theme.spacing(6),
      },
    },
    paper: {
      margin: theme.spacing(1),
    },
  });
});

interface IProps extends DialogProps {
  open: boolean;
  onClose: () => void;
}

const Modal: React.FC<IProps> = ({ children, open, onClose, ...rest }) => {
  const classes = useStyles();
  return (
    <Dialog
      {...rest}
      onClose={onClose}
      open={open}
      maxWidth="md"
      PaperProps={{ elevation: 0, className: classes.paper }}
    >
      <Box className={classes.innerBox}>{children}</Box>
    </Dialog>
  );
};

export default Modal;
