import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Image from "material-ui-image";
import Bowl from "../assets/images/bowl.png";
import { GRADIENT_AQUA, GRADIENT_ORANGE } from "../theme";

const useStyles = makeStyles({});

const Background = ({}) => {
  const classes = useStyles();
  return (
    <Box
      height="100vh"
      position="absolute"
      top="0"
      left="0"
      overflow="hidden"
      width="100%"
    >
      <Box display="flex" height="100%" width="100%">
        <Box
          width="50%"
          height="100%"
          style={{
            backgroundImage: GRADIENT_AQUA,
          }}
        ></Box>
        <Box
          width="50%"
          height="100%"
          style={{
            backgroundImage: GRADIENT_ORANGE,
          }}
        ></Box>
      </Box>
      {/* <Box display="flex" justifyContent="center">
        <Box position="absolute" width="800px" bottom="-10%">
          <Image
            src={Bowl}
            animationDuration={1000}
            style={{ width: "100%", backgroundColor: "transparent" }}
          ></Image>
        </Box>
      </Box> */}
    </Box>
  );
};

export default Background;
