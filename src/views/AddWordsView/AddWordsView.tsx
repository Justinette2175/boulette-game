import React, { useState, useContext } from "react";
import { Store, User } from "../../types";
import { userStillHasWordsToWrite } from "../../utils";
import WordsSelector from "./WordsSelector";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";

import { Button, Box, Typography, Grid } from "@material-ui/core";
import { Plus, FileText, ArrowRight, CheckCircle } from "react-feather";
import UserAvatar from "../../components/UserAvatar";

import ContentWrapper from "../../components/ContentWrapper";

import COPY from "../../copy";
import GameContext from "../../contexts/GameContext";
import { useGamePlayers, useGameRef, useOwnerIsOnDevice } from "../../hooks";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import useGameWords from "../../hooks/useGameWords";
import { FirebasePlayer, GameStage } from "../../types/firebaseTypes";

const PrepareGame: React.FC = () => {
  const game = useContext(GameContext);
  const players = useGamePlayers();
  const deviceId = useContext(DeviceIdContext);
  const gameRef = useGameRef();
  const words = useGameWords();
  const language = "EN";
  const { wordsPerPlayer, owner } = game;
  const allWordsAreSet = players.length <= words.length;
  const computerUsers = players.filter((p) => p.deviceId === deviceId);
  const ownerIsOnDevice = useOwnerIsOnDevice();

  const [wordsModalUser, setWordsModalUser] = useState<FirebasePlayer>(null);

  const handleNext = () => {
    const stage: GameStage = "REVIEWING_TEAMS";
    gameRef.update({ stage });
  };

  const closeAddWords = () => setWordsModalUser(null);

  return (
    <>
      <ContentWrapper
        maxWidth={600}
        leftChild={
          <>
            <Typography variant="h2">
              {COPY.ADD_WORDS_TITLE[language]}
            </Typography>
            <Grid container spacing={4}>
              {computerUsers.map((user) => {
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
                          <FileText size={15} style={{ marginRight: "8px" }} />
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
              })}
            </Grid>
          </>
        }
        rightChild={
          <>
            <Box mb={2} maxWidth="300px">
              <Typography variant="h4" component="p">
                {ownerIsOnDevice
                  ? COPY.ADD_WORDS_NEXT[language]
                  : COPY.ADD_WORDS_WAIT[language]}
              </Typography>
            </Box>
            {ownerIsOnDevice && (
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
        {/* <RemoteCallsStrip includeLocal includeNames={false} /> */}
      </Box>
    </>
  );
};

export default PrepareGame;
