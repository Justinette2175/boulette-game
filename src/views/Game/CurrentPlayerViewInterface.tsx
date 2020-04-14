import React from "react";
import { Button, Box } from "@material-ui/core";
import { Word } from "../../types";
import WordOnPaper from "../../components/WordOnPaper";

interface IProps {
  onFound: () => void;
  onStart: () => void;
  currentWord: Word;
}

const Game: React.FC<IProps> = ({ onFound, onStart, currentWord }) => {
  return (
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
          Get Word
        </Button>
      )}
      {!!currentWord && (
        <>
          <Box mb={4}>
            <WordOnPaper word={currentWord.text} />
          </Box>
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
  );
};

export default Game;
