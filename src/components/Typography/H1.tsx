import React from "react";
import { Typography, TypographyProps } from "@material-ui/core";
import clx from "classnames";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    h1: {
      fontSize: "3rem",
      [theme.breakpoints.up("sm")]: {
        fontSize: "4rem",
      },
    },
  });
});

const H1: React.FC<TypographyProps> = ({ children, className, ...rest }) => {
  const classes = useStyles();
  return (
    <Typography variant="h1" className={clx(classes.h1, className)} {...rest}>
      {children}
    </Typography>
  );
};

export default H1;
