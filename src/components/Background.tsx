import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import Image from "material-ui-image";
import Bowl from "../assets/images/bowl.png";
import { GRADIENT_AQUA, GRADIENT_ORANGE } from "../theme";
import SliderWrapper from "./SliderWrapper";
import { Store } from "../types";

const Background = ({}) => {
  const currentTeam = useSelector((state: Store) => state.game.currentTeam);
  const gameWinner = useSelector((state: Store) => state.game.winner);
  console.log("background team", currentTeam);
  const placement =
    !!gameWinner || !currentTeam
      ? "center"
      : currentTeam === "1"
      ? "left"
      : "right";
  console.log("background team", placement);

  return (
    <Box
      minHeight="100vh"
      position="fixed"
      top="0"
      left="0"
      bottom="0"
      right="0"
      overflow="hidden"
    >
      <SliderWrapper
        leftChild={
          <Box
            height="100%"
            width="100%"
            style={{
              backgroundImage: GRADIENT_AQUA,
            }}
          ></Box>
        }
        rightChild={
          <Box
            height="100%"
            width="100%"
            style={{
              backgroundImage: GRADIENT_ORANGE,
            }}
          ></Box>
        }
        placement={placement}
      />
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
