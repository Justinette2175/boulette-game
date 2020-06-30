import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import WordTransitionWrapper from "../../components/WordTransitionWrapper";

import Bowl from "../../components/Bowl";
import LocalCall from "../../components/LocalCall";

import { FirebaseGameWord } from "../../types/firebaseTypes";

interface IProps {
  onFound: (wordId: string) => void;
  onStart: () => void;
  currentWord: FirebaseGameWord;
}

const CurrentPlayerViewInterface: React.FC<IProps> = ({
  onFound,
  onStart,
  currentWord,
}) => {
  const handleBowlClick = () => {
    if (currentWord) {
      onFound(currentWord.id);
    } else {
      onStart();
    }
  };
  return (
    <Box position="relative" flexGrow={1}>
      <Box
        display="flex"
        height="240px"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        position="relative"
        zIndex={300}
        mt={2}
      >
        {!!currentWord && <WordTransitionWrapper currentWord={currentWord} />}
      </Box>
      <Box position="absolute" width="100%">
        <Box
          position="absolute"
          width="200px"
          display="flex"
          justifyContent="center"
          left="50%"
          marginLeft="-100px"
          zIndex={400}
          top="50px"
        >
          <Box
            bgcolor="primary.main"
            borderRadius="borderRadius"
            px={3}
            py={2}
            boxShadow={1}
          >
            <Typography variant="h2" style={{ fontWeight: 500, margin: 0 }}>
              {currentWord ? "Start" : "Found"}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center" onClick={handleBowlClick}>
          <Bowl />
        </Box>
      </Box>
      {/* <Box position="absolute" bottom={0} left={0}>
        <LocalCall />
      </Box> */}
    </Box>
  );
};

export default CurrentPlayerViewInterface;
