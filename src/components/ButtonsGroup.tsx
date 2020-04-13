import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    button: {
      "&.MuiButton-root": {
        marginLeft: theme.spacing(1),
      },
      "&:first-child": {
        marginLeft: 0,
      },
    },
  });
});

interface IProps {
  children: any;
  removeTopMargin?: boolean;
}

const ButtonsGroup: React.FC<IProps> = ({ children, ...rest }) => {
  const classes = useStyles();
  const childrenWithProps = React.Children.map(children, (child) => {
    return (
      child && React.cloneElement(child, { classes: { root: classes.button } })
    );
  });
  return (
    children && (
      <Box display="flex" mt={rest.removeTopMargin ? 0 : 2}>
        {childrenWithProps}
      </Box>
    )
  );
};

export default ButtonsGroup;
