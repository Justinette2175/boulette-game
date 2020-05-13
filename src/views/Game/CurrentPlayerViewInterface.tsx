import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Word } from "../../types";
import WordTransitionWrapper from "../../components/WordTransitionWrapper";
import { useSelector } from "react-redux";
import { Store } from "../../types";

import Bowl from "../../components/Bowl";
import LocalCall from "../../components/LocalCall";

import COPY from "../../copy";

interface IProps {
  onFound: () => void;
  onStart: () => void;
  currentWord: Word;
}

const Game: React.FC<IProps> = ({ onFound, onStart, currentWord }) => {
  const language = useSelector((state: Store) => state.computer.language);

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
        mt={2}
      >
        {!currentWord && (
          <>
            <Typography variant="h2" align="center">
              {COPY.TAP_BOWL_INSTRUCTIONS[language]}
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              {COPY.TAP_BOWL_INSTRUCTIONS_2[language]}
            </Typography>
          </>
        )}
        {!!currentWord && (
          <>
            <Typography variant="body1" align="center" gutterBottom>
              {COPY.TAP_BOWL_FOR_NEXT_INSTRUCTIONS[language]}
            </Typography>
            <Box mt={4}>
              <WordTransitionWrapper currentWord={currentWord} />
            </Box>
          </>
        )}
      </Box>
      <Box
        position="absolute"
        bottom="-150px"
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
