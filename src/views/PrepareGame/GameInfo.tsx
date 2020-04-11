import React from "react";
import { useSelector } from "react-redux";
import { Store, Username, GameId } from "../../types";
import { Typography, Box } from "@material-ui/core";

const GameInfo: React.FC = () => {
  const gameId: GameId = useSelector((state: Store) => state.game.id);
  const gameOwner: Username = useSelector((state: Store) => state.game.owner);
  return (
    <Box>
      <Typography variant="h2">Game</Typography>
      <Typography variant="body1">Game room number: {gameId}</Typography>
      <Typography variant="body1">Owner: {gameOwner}</Typography>
    </Box>
  );
};

export default GameInfo;
