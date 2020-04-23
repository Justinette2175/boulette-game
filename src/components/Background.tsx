import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import { GRADIENT_AQUA, GRADIENT_ORANGE } from "../theme";
import SliderWrapper from "./SliderWrapper";
import { Store } from "../types";

const Background = ({}) => {
  const currentTeam = useSelector((state: Store) => state.game.currentTeam);
  const gameWinner = useSelector((state: Store) => state.game.winner);
  const placement =
    !!gameWinner || !currentTeam
      ? "center"
      : currentTeam === "1"
      ? "left"
      : "right";

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
        displace
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
    </Box>
  );
};

export default Background;
