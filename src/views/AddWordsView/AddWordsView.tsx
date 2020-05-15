import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Store, User } from "../../types";
import { userStillHasWordsToWrite } from "../../utils";
import GameService from "../../services/game";
import WordsSelector from "./WordsSelector";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";

import { Button, Box, Typography, Grid } from "@material-ui/core";
import { Plus, FileText, ArrowRight, CheckCircle } from "react-feather";
import UserAvatar from "../../components/UserAvatar";

import ContentWrapper from "../../components/ContentWrapper";

import COPY from "../../copy";

const PrepareGame: React.FC = () => {
  const gameOwner = useSelector((state: Store) => state.game.owner);
  const players = useSelector((state: Store) => state.game.users);
  const words = useSelector((state: Store) => state.game.words);
  const language = useSelector((state: Store) => state.computer.language);
  const wordsPerPlayer = useSelector(
    (state: Store) => state.game.wordsPerPlayer
  );
  const allWordsAreSet = players.length <= words.length;
  const computerUserIds = useSelector((state: Store) => state.computer.users);
  const ownerIsOnComputer = computerUserIds.indexOf(gameOwner) > -1;

  const [wordsModalUser, setWordsModalUser] = useState<User>(null);

  const handleNext = () => {
    GameService.reviewTeams();
  };

  const closeAddWords = () => setWordsModalUser(null);

  return (
    <>
      <ContentWrapper
        leftChild={
          <>
            <Typography variant="h2">
              {COPY.ADD_WORDS_TITLE[language]}
            </Typography>
            <Grid container spacing={4}>
              {computerUserIds.map((uId) => {
                const user = players.find((u) => u.id === uId);
                if (user) {
                  const [canAddWords, userWords] = userStillHasWordsToWrite(
                    words,
                    user,
                    wordsPerPlayer
                  );
                  return (
                    <Grid item>
                      <Box>
                        <Typography>{user.name}</Typography>
                        <UserAvatar my={1} />
                        <Typography gutterBottom>
                          {canAddWords ? (
                            <FileText
                              size={15}
                              style={{ marginRight: "8px" }}
                            />
                          ) : (
                            <CheckCircle
                              size={15}
                              style={{ marginRight: "8px" }}
                            />
                          )}
                          {userWords.length} {COPY.WORD[language]}
                          {userWords.length > 1 && "s"}
                        </Typography>
                        {canAddWords && (
                          <Button
                            onClick={() => setWordsModalUser(user)}
                            variant="outlined"
                            startIcon={<Plus size={15} />}
                            size="small"
                          >
                            {COPY.ADD_WORDS_BUTTON[language]}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  );
                }
              })}
            </Grid>
          </>
        }
        rightChild={
          <>
            <Box mb={2} maxWidth="300px">
              <Typography variant="h4" component="p">
                {ownerIsOnComputer
                  ? COPY.ADD_WORDS_NEXT[language]
                  : COPY.ADD_WORDS_WAIT[language]}
              </Typography>
            </Box>
            {ownerIsOnComputer && (
              <Box>
                <Button
                  onClick={handleNext}
                  color="primary"
                  variant="contained"
                  startIcon={<ArrowRight />}
                  disabled={!allWordsAreSet}
                >
                  {COPY.NEXT[language]}
                </Button>
              </Box>
            )}
          </>
        }
      />

      <WordsSelector
        open={!!wordsModalUser}
        user={wordsModalUser}
        onClose={closeAddWords}
      />

      <Box position="fixed" style={{ left: 0, bottom: 0, right: 0 }}>
        <RemoteCallsStrip includeLocal includeNames={false} />
      </Box>
    </>
  );
};

export default PrepareGame;
