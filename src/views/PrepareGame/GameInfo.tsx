import React from "react";
import { useSelector } from "react-redux";
import { Store, Username, GameId } from "../../types";
import { Typography, Box } from "@material-ui/core";

const GameInfo: React.FC = () => {
  const gameId: GameId = useSelector((state: Store) => state.game.id);
  const gameOwnerName: Username = useSelector((state: Store) => {
    const owner = state.game.users.find((u) => u.id === state.game.owner);
    return owner ? owner.name : null;
  });
  return (
    <Box mb={2}>
      <Typography variant="h2"># {gameId}</Typography>
      <Typography variant="body1">Game owner: {gameOwnerName}</Typography>
    </Box>
  );
};

export default GameInfo;
