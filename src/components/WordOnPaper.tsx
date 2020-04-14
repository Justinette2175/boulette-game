import React from "react";
import { Box, Typography } from "@material-ui/core";
import PaperImage from "../assets/images/paper.png";
import Image from "material-ui-image";

interface IProps {
  word: string;
}

const WordOnPaper: React.FC<IProps> = ({ word }) => {
  return (
    <Box position="relative" width="350px">
      <img
        src={PaperImage}
        width="100%"
        style={{ backgroundColor: "transparent" }}
      />
      <Box
        position="absolute"
        top="0"
        right="0"
        left="0"
        bottom="0"
        display="flex"
        alignItems="center"
        height="100%"
        justifyContent="center"
        p={2}
      >
        <Typography align="center" variant="h3">
          {word}
        </Typography>
      </Box>
    </Box>
  );
};

export default WordOnPaper;
