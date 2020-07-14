import React, { useContext } from "react";
import { Typography, Box, BoxProps } from "@material-ui/core";
import { BASE_URL } from "../constants";
import GameContext from "../contexts/GameContext";

const GameLink: React.FC<BoxProps> = (props) => {
  let game = useContext(GameContext);

  if (game && game.id) {
    return (
      <Box {...props}>
        <Box display="flex" alignItems="center">
          <Typography
            color="primary"
            variant="body1"
          >{`${BASE_URL}/games/${game.id}`}</Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export default GameLink;
