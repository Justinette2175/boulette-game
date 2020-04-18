import React, { ReactNode } from "react";
import { Box } from "@material-ui/core";
import { SCORE_BOARD_WIDTH } from "../constants";

interface IProps {
  placement: "left" | "right" | "center";
  rightChild: ReactNode;
  leftChild: ReactNode;
}

const SliderWrapper: React.FC<IProps> = ({
  leftChild,
  rightChild,
  placement,
}) => {
  return (
    <Box
      width="200vw"
      display="flex"
      position="relative"
      style={{ transition: "all 1s" }}
      right={
        placement === "center"
          ? `calc(50vw - ${SCORE_BOARD_WIDTH / 2}px)`
          : placement === "left"
          ? 0
          : `calc(100vw - ${SCORE_BOARD_WIDTH}px)`
      }
    >
      <Box width={`calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)`} height="100vh">
        {leftChild}
      </Box>
      <Box width={`calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)`} height="100vh">
        {rightChild}
      </Box>
    </Box>
  );
};

export default SliderWrapper;
