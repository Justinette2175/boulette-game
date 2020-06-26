import React, { useContext } from "react";
import { Typography, Box, BoxProps } from "@material-ui/core";
import { BASE_URL } from "../constants";
import GameContext from "../contexts/GameContext";

import COPY from "../copy";

const GameLink: React.FC<BoxProps> = (props) => {
  let game = useContext(GameContext);
  const language = "EN";

  if (game && game.id) {
    return (
      <Box {...props}>
        <Typography variant="body2">
          {COPY.SHARE_LINK_INSTRUCTIONS[language]}
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography
            color="primary"
            variant="caption"
          >{`${BASE_URL}?gameId=${game.id}`}</Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export default GameLink;
