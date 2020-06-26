import React from "react";
import { Box, useTheme } from "@material-ui/core";
import SliderWrapper from "./SliderWrapper";

const Background = ({}) => {
  const theme = useTheme();
  // const placement =
  //   !!gameWinner || !currentTeam
  //     ? "center"
  //     : currentTeam === "1"
  //     ? "left"
  //     : "right";
  const placement = "left";

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
              backgroundColor: theme.palette.secondary.light,
            }}
          ></Box>
        }
        rightChild={
          <Box
            height="100%"
            width="100%"
            style={{
              backgroundColor: theme.palette.primary.light,
            }}
          ></Box>
        }
        placement={placement}
      />
    </Box>
  );
};

export default Background;
