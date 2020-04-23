import React from "react";
import Image from "material-ui-image";
import Bol from "../assets/images/bol.png";
import BolBlanc from "../assets/images/bol-blanc.png";
import { Box } from "@material-ui/core";

const Bowl: React.FC = () => {
  return (
    <Box width="500px">
      <Image
        src={BolBlanc}
        animationDuration={1000}
        color="transparent"
        imageStyle={{ height: "auto" }}
      ></Image>
      <Image
        src={Bol}
        color="transparent"
        animationDuration={1000}
        imageStyle={{ height: "auto" }}
      ></Image>
    </Box>
  );
};

export default Bowl;
