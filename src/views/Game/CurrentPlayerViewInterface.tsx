import React from "react";
import { Button, Box } from "@material-ui/core";
import { Word } from "../../types";
import WordTransitionWrapper from "../../components/WordTransitionWrapper";
import Timer from "./Timer";

interface IProps {
  onFound: () => void;
  onStart: () => void;
  currentWord: Word;
}

const Game: React.FC<IProps> = ({ onFound, onStart, currentWord }) => {
  console.log("current word is", currentWord);
  return (
    <>
      <Timer />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {!currentWord && (
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={onStart}
          >
            Start my turn
          </Button>
        )}
        {!!currentWord && (
          <>
            <WordTransitionWrapper currentWord={currentWord} />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onFound}
            >
              Mark as found
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

export default Game;
