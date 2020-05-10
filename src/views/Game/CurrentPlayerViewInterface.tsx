import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Word } from "../../types";
import WordTransitionWrapper from "../../components/WordTransitionWrapper";
import Timer from "./Timer";
import Bowl from "../../components/Bowl";
import LocalCall from "../../components/LocalCall";

interface IProps {
  onFound: () => void;
  onStart: () => void;
  currentWord: Word;
}

const Game: React.FC<IProps> = ({ onFound, onStart, currentWord }) => {
  const handleBowlClick = () => {
    if (currentWord) {
      onFound();
    } else {
      onStart();
    }
  };
  return (
    <Box position="relative" flexGrow={1}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        position="relative"
        zIndex={300}
        mt={4}
      >
        {!currentWord && (
          <>
            <Typography variant="h3" align="center">
              Tap the bowl to start your turn.
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              When a word appears, have your teammates guess. You can review
              this round's instructions by clicking on the round number at the
              top.
            </Typography>
          </>
        )}
        {!!currentWord && (
          <>
            <Typography variant="body1" align="center" gutterBottom>
              Tap the bowl when your teammates guess the word to count a point.
            </Typography>
            <WordTransitionWrapper currentWord={currentWord} />
          </>
        )}
      </Box>
      <Box
        position="absolute"
        bottom="-50px"
        width="100%"
        display="flex"
        justifyContent="center"
        onClick={handleBowlClick}
      >
        <Bowl />
      </Box>
      <Box position="absolute" bottom={0} left={0}>
        <LocalCall />
      </Box>
    </Box>
  );
};

export default Game;
