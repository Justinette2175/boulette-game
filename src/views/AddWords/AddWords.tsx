import React, { useState, useContext } from "react";
import { userStillHasWordsToWrite } from "../../utils";
import WordsSelector from "./WordsSelector";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";

import {
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  useTheme,
} from "@material-ui/core";
import { Plus, ArrowRight, CheckCircle } from "react-feather";

import COPY from "../../copy";
import GameContext from "../../contexts/GameContext";
import { useGameRef, useOwnerIsOnDevice, useGamePlayers } from "../../hooks";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import useGameWords from "../../hooks/useGameWords";
import { FirebasePlayer, GameStage } from "../../types/firebaseTypes";
import getPlayersMissingWords from "../../utils/getPlayersMissingWords";

const AddWords: React.FC = () => {
  const game = useContext(GameContext);
  const players = useGamePlayers();
  const deviceId = useContext(DeviceIdContext);
  const gameRef = useGameRef();
  const words = useGameWords();
  const language = "EN";
  const { wordsPerPlayer } = game;
  const allWordsAreSet = players.length <= words.length;
  const deviceUsers = players.filter((p) => p.deviceId === deviceId);
  const ownerIsOnDevice = useOwnerIsOnDevice();

  const [wordsModalUser, setWordsModalUser] = useState<FirebasePlayer>(null);

  const handleNext = () => {
    const stage: GameStage = "REVIEWING_TEAMS";
    gameRef.update({ stage });
  };

  const closeAddWords = () => setWordsModalUser(null);

  const playersMissingWords = getPlayersMissingWords(
    players,
    words,
    game.wordsPerPlayer
  );

  const theme = useTheme();

  return (
    <>
      <RemoteCallsStrip />
      <Box pt={8} px={4}>
        <Typography variant="h1" gutterBottom>
          {COPY.ADD_WORDS_TITLE[language]}
        </Typography>
        <Box maxWidth="4++00px">
          <Grid container spacing={1}>
            {deviceUsers.map((user) => {
              const [canAddWords, userWords] = userStillHasWordsToWrite(
                words,
                user,
                wordsPerPlayer
              );
              return (
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center">
                    <Box flexGrow={1}>
                      <PlayerAndAvatar name={user.name} />
                    </Box>
                    <Typography style={{ marginBottom: 0 }}>
                      {userWords.length}{" "}
                      <span style={{ color: theme.palette.primary.dark }}>
                        / {game.wordsPerPlayer}
                      </span>
                    </Typography>
                    <Box ml={1}>
                      {canAddWords ? (
                        <IconButton
                          onClick={() => setWordsModalUser(user)}
                          color="primary"
                        >
                          <Plus size={20} />
                        </IconButton>
                      ) : (
                        <IconButton color="primary">
                          <CheckCircle size={18} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          {playersMissingWords.length > 0 && (
            <Box>
              <Typography variant="body1">
                Still waiting for {playersMissingWords.join(", ")}.
              </Typography>
            </Box>
          )}
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
        </Box>
      </Box>

      <WordsSelector
        open={!!wordsModalUser}
        user={wordsModalUser}
        onClose={closeAddWords}
      />
    </>
  );
};

export default AddWords;
