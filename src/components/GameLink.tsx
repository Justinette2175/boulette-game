import React from "react";
import { useSelector } from "react-redux";
import { Typography, Box, BoxProps } from "@material-ui/core";
import SimpleIconButton from "./SimpleIconButton";
import { BASE_URL } from "../constants";
import { Store } from "../types";
import { Copy } from "react-feather";

import COPY from "../copy";

const GameLink: React.FC<BoxProps> = (props) => {
  let gameId = useSelector((state: Store) => state.game.id);
  const language = useSelector((state: Store) => state.computer.language);

  const handleClick = () => {
    console.log("clicked");
  };

  if (gameId) {
    return (
      <Box {...props}>
        <Typography variant="body2">
          {COPY.SHARE_LINK_INSTRUCTIONS[language]}
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography
            color="primary"
            variant="caption"
          >{`${BASE_URL}?gameId=${gameId}`}</Typography>
          <Box ml={1}>
            <SimpleIconButton onClick={handleClick} color="primary">
              <Copy size={18} />
            </SimpleIconButton>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};

export default GameLink;
