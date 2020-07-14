import React from "react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box, BoxProps } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    wrapper: {
      backgroundColor: theme.palette.background.paper,
      [theme.breakpoints.down("xs")]: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        width: `calc(100% + ${theme.spacing(3) * 2}px)`,
        margin: `0 -${theme.spacing(4)}px`,
        padding: `0 ${theme.spacing(4)}px`,
      },
      [theme.breakpoints.up("sm")]: {
        width: "auto",
        maxWidth: ({ maxWidth }: { maxWidth: number }) =>
          `${maxWidth}px` || "500px",
        padding: theme.spacing(3),
      },
    },
  });
});

interface LighterBoxProps extends BoxProps {
  maxWidth?: number;
}

const LighterBox: React.FC<LighterBoxProps> = ({
  children,
  maxWidth,
  ...rest
}) => {
  const classes = useStyles({ maxWidth });
  return (
    <Box className={classes.wrapper} {...rest}>
      {children}
    </Box>
  );
};

export default LighterBox;
