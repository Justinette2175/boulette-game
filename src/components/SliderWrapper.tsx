import React, { ReactNode } from "react";
import { Box } from "@material-ui/core";
import { SCORE_BOARD_WIDTH } from "../constants";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

interface IProps {
  placement: "left" | "right" | "center";
  rightChild: ReactNode;
  leftChild: ReactNode;
  displace?: boolean;
}

const SliderWrapper: React.FC<IProps> = ({
  leftChild,
  rightChild,
  placement,
  displace,
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const distance = !displace ? 0 : matches ? SCORE_BOARD_WIDTH : 100;
  return (
    <Box
      width="200vw"
      display="flex"
      position="relative"
      style={{ transition: "all 1s" }}
      right={
        placement === "center"
          ? `calc(50vw - ${distance / 2}px)`
          : placement === "left"
          ? 0
          : `calc(100vw - ${distance}px)`
      }
    >
      <Box width={`calc(100vw - ${distance / 2}px)`} height="100vh">
        {leftChild}
      </Box>
      <Box width={`calc(100vw - ${distance / 2}px)`} height="100vh">
        {rightChild}
      </Box>
    </Box>
  );
};

export default SliderWrapper;
