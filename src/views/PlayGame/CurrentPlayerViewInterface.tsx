import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import WordTransitionWrapper from "../../components/WordTransitionWrapper";

import Bowl from "../../components/Bowl";

import { FirebaseGameWord } from "../../types/firebaseTypes";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    goButton: {
      fontSize: "3rem",
      padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    },
  });
});

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

  const classes = useStyles();

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
      <Box position="relative" width="100%">
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
          <Button
            classes={{ root: classes.goButton }}
            color="secondary"
            variant="contained"
            onClick={handleBowlClick}
          >
            {currentWord ? "Found" : "Start"}
          </Button>
        </Box>
        <Box display="flex" justifyContent="center">
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
