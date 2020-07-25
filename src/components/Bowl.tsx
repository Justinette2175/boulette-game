import React from "react";
import BowlImg from "../assets/images/bowl.png";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  bowlBackground: {},
  bowl: {
    display: "block",
  },
});

const Bowl: React.FC = () => {
  const classes = useStyles();
  return (
    <Box width="97%" maxWidth="800px" position="relative" minWidth="450px">
      <img className={classes.bowl} src={BowlImg} width="100%"></img>
    </Box>
  );
};

export default Bowl;
