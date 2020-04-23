import React from "react";
import Image from "material-ui-image";
import Bol from "../assets/images/bol.png";
import BolBlanc from "../assets/images/bol-blanc.png";
import BolVert from "../assets/images/bol-vert.png";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  bowlBackground: {},
  bowl: {
    position: "absolute",
    left: 0,
    top: 0,
    transform: "scale(0.98)",
  },
  coloredBowl: {
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0,
    transition: ".5s",
    transform: "scale(0.98)",
    "&:hover": {
      cursor: "pointer",
      opacity: 1,
    },
  },
});

const Bowl: React.FC = () => {
  const classes = useStyles();
  return (
    <Box width="90vw" maxWidth="800px" position="relative" minWidth="450px">
      <img className={classes.bowlBackground} src={BolBlanc} width="100%"></img>
      <img className={classes.bowl} src={Bol} width="100%"></img>
      <img className={classes.coloredBowl} src={BolVert} width="100%"></img>
    </Box>
  );
};

export default Bowl;
