import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Store, User } from "../../types";
import { userStillHasWordsToWrite } from "../../utils";
import GameService from "../../services/game";
import WordsSelector from "./WordsSelector";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";

import { Button, Box, Typography, Grid, useTheme } from "@material-ui/core";
import { Plus, FileText, ArrowRight } from "react-feather";
import UserAvatar from "../../components/UserAvatar";

const PrepareGame: React.FC = () => {
  const theme = useTheme();
  const gameOwner = useSelector((state: Store) => state.game.owner);
  const players = useSelector((state: Store) => state.game.users);
  const words = useSelector((state: Store) => state.game.words);
  // const allWordsAreSet =
  //   players.length * WORDS_PER_PLAYER === words.length && players.length >= 4;
  const allWordsAreSet = players.length <= words.length;
  const computerUserIds = useSelector((state: Store) => state.computer.users);
  const ownerIsOnComputer = computerUserIds.indexOf(gameOwner) > -1;

  const [wordsModalUser, setWordsModalUser] = useState<User>(null);

  const handleStartGame = () => {
    GameService.startGame();
  };

  const closeAddWords = () => setWordsModalUser(null);

  return (
    <>
      <Box px={6} py={4}>
        <Typography variant="h1">Add words to the bowl</Typography>
      </Box>
      <Box
        px={6}
        py={4}
        style={{ backgroundColor: theme.palette.secondary.light }}
      >
        <Grid container spacing={4}>
          {computerUserIds.map((uId) => {
            const user = players.find((u) => u.id === uId);
            if (user) {
              const [canAddWords, userWords] = userStillHasWordsToWrite(
                words,
                user
              );
              return (
                <Grid item>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Typography>{user.name}</Typography>
                    <UserAvatar my={1} />
                    <Typography gutterBottom>
                      <FileText size={15} style={{ marginRight: "8px" }} />
                      {userWords.length} word
                    </Typography>
                    {canAddWords && (
                      <Button
                        onClick={() => setWordsModalUser(user)}
                        variant="outlined"
                        startIcon={<Plus size={15} />}
                      >
                        Write words
                      </Button>
                    )}
                  </Box>
                </Grid>
              );
            }
          })}
        </Grid>
        <Box display="flex" flexDirection="column" my={4}>
          <Box mb={2} maxWidth="300px">
            <Typography variant="body2">
              {ownerIsOnComputer
                ? "When all players have added words, start the game."
                : "The game will start once all players have added their words to the bowl."}
            </Typography>
          </Box>
          {ownerIsOnComputer && (
            <Box>
              <Button
                onClick={handleStartGame}
                color="primary"
                variant="contained"
                startIcon={<ArrowRight />}
                disabled={!allWordsAreSet}
              >
                Start the game!
              </Button>
            </Box>
          )}
        </Box>

        <WordsSelector
          user={wordsModalUser}
          onClose={closeAddWords}
          open={!!wordsModalUser}
        />

        <Box position="fixed" bottom={theme.spacing(6)} left={theme.spacing(6)}>
          <RemoteCallsStrip />
        </Box>
      </Box>
    </>
  );
};

export default PrepareGame;
