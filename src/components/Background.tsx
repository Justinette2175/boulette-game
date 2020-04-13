import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import Image from "material-ui-image";
import Bowl from "../assets/images/bowl.png";
import { GRADIENT_AQUA, GRADIENT_ORANGE } from "../theme";
import { Store } from "../types";
import { SCORE_BOARD_WIDTH } from "../constants";

const Background = ({}) => {
  const currentTeam = useSelector((state: Store) => state.game.currentTeam);
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
          width={
            !currentTeam
              ? "50%"
              : currentTeam === "1"
              ? `calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)`
              : `${SCORE_BOARD_WIDTH / 2}px`
          }
          height="100%"
          style={{
            transition: "all 1s",
            backgroundImage: GRADIENT_AQUA,
          }}
        ></Box>
        <Box
          width={
            !currentTeam
              ? "50%"
              : currentTeam === "2"
              ? `calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)`
              : `${SCORE_BOARD_WIDTH / 2}px`
          }
          height="100%"
          style={{
            transition: "all 1s",
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
