import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Store, User } from "../../types";
import AddPlayerOnComputer from "./AddPlayerOnComputer";
import GameService from "../../services/game";
import WordsSelector from "./WordsSelector";

import GameInfo from "./GameInfo";
import TeamsSelector from "./TeamsSelector";
import { Button, Divider, Box, Paper, Typography } from "@material-ui/core";

import { WORDS_PER_PLAYER } from "../../constants";

const PrepareGame: React.FC = () => {
  const gameOwner = useSelector((state: Store) => state.game.owner);
  const players = useSelector((state: Store) => state.game.users);
  const words = useSelector((state: Store) => state.game.words);
  // const allWordsAreSet =
  //   players.length * WORDS_PER_PLAYER === words.length && players.length >= 4;
  const allWordsAreSet = players.length <= words.length;
  const computerUsers = useSelector((state: Store) => state.computer.users);
  const ownerIsOnComputer = computerUsers.indexOf(gameOwner) > -1;

  const [wordsModalUser, setWordsModalUser] = useState<User>(null);
  const [addPlayerIsVisible, setAddPlayerIsVisible] = useState<boolean>(false);

  const handleStartGame = () => {
    GameService.startGame();
  };

  const handleOpenAddWords = (user: User) => {
    setWordsModalUser(user);
  };

  const closeAddWords = () => setWordsModalUser(null);

  return (
    <Box
      minHeight="100vh"
      p={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box display="inline-block">
        <Paper style={{ height: "100%", width: "100%" }} elevation={0}>
          <Box p={4}>
            <GameInfo />
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
            >
              <Typography variant="h1" align="center">
                Waiting room
              </Typography>
              <Box my={1}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => setAddPlayerIsVisible(true)}
                >
                  Add a player on this device
                </Button>
              </Box>
              <Typography variant="body1" align="center">
                Each player choses {WORDS_PER_PLAYER} words to put in the bowl.
              </Typography>
            </Box>
            <TeamsSelector onOpenAddWords={handleOpenAddWords} />
            <AddPlayerOnComputer
              open={addPlayerIsVisible}
              onClose={() => setAddPlayerIsVisible(false)}
            />
            <WordsSelector
              user={wordsModalUser}
              onClose={closeAddWords}
              open={!!wordsModalUser}
            />
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              {!allWordsAreSet && ownerIsOnComputer && (
                <Box mb={1}>
                  <Typography variant="body2" align="center">
                    You need at least four players to start the game, and they
                    must all place words in the bowl.
                  </Typography>
                </Box>
              )}
              {ownerIsOnComputer && (
                <Button
                  disabled={!allWordsAreSet}
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleStartGame}
                >
                  Start the game!
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default PrepareGame;
