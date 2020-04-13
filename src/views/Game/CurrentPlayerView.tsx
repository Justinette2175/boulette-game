import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Box, Paper } from "@material-ui/core";
import { markWordAsFound, startMiming } from "../../redux/game";
import { Store } from "../../types";

const Game: React.FC = () => {
  const dispatch = useDispatch();
  const currentWord = useSelector((state: Store) => state.game.currentWord);
  const round = useSelector((state: Store) =>
    state.game.rounds.find((r) => r.id === state.game.currentRound)
  );

  const handleStart = () => {
    dispatch(startMiming());
  };

  const handleFound = () => {
    dispatch(markWordAsFound(currentWord));
  };

  return (
    <Box>
      {!currentWord && (
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={handleStart}
        >
          Get Word
        </Button>
      )}
      {!!currentWord && (
        <>
          <Paper>{currentWord.text}</Paper>
          <Button onClick={handleFound}>Mark as found</Button>
        </>
      )}
    </Box>
  );
};

export default Game;
