import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, BoxProps } from "@material-ui/core";
import clx from "classnames";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paddingRemover: {
      // padding: `0 -${theme.spacing(3)}px`,
      // [theme.breakpoints.up("md")]: {
      //   padding: `0 -${theme.spacing(6)}px`,
      // },
      // [theme.breakpoints.up("lg")]: {
      //   padding: `0 -${theme.spacing(8)}px`,
      // },
    },
  });
});

interface PaddingRemoverProps extends BoxProps {}

const PaddingRemover: React.FC<PaddingRemoverProps> = ({
  children,
  className,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Box className={clx(classes.paddingRemover, className)} {...rest}>
      {children}
    </Box>
  );
};

export default PaddingRemover;
