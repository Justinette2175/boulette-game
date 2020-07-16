import React, { useState, useContext, useEffect } from "react";
import { userStillHasWordsToWrite } from "../../utils";
import WordsSelector from "./WordsSelector";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";

import writeWords from "../../assets/images/write-words.png";

import {
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  useTheme,
} from "@material-ui/core";
import { Plus, ArrowRight, CheckCircle } from "react-feather";
import { NextButton } from "../../components/Buttons";

import COPY from "../../copy";
import GameContext from "../../contexts/GameContext";
import { useGameRef, useOwnerIsOnDevice, useGamePlayers } from "../../hooks";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import useGameWords from "../../hooks/useGameWords";
import { FirebasePlayer, GameStage } from "../../types/firebaseTypes";
import getPlayersMissingWords from "../../utils/getPlayersMissingWords";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { H1 } from "../../components/Typography";
import { ViewWrapper } from "../../components/Containers";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    h1: {
      [theme.breakpoints.down("xs")]: {
        maxWidth: "300px",
      },
    },
    instructions: {
      marginBottom: theme.spacing(3),
      [theme.breakpoints.down("xs")]: {
        maxWidth: "200px",
        marginBottom: theme.spacing(6),
      },
    },
    leftBox: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
        marginRight: theme.spacing(2),
      },
    },
    rightBox: {
      flex: 0,

      [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
        flex: 3,
      },
    },
    imageWrapper: {
      [theme.breakpoints.down("xs")]: {
        position: "absolute",
        top: "96px",
        left: "48%",
        width: "230px",
        transform: "rotate(-5deg)",
      },
    },
    wordsWrapper: {
      [theme.breakpoints.down("xs")]: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        width: `calc(100% + ${theme.spacing(3) * 2}px)`,
        margin: `0 -${theme.spacing(4)}px`,
        padding: `0 ${theme.spacing(4)}px`,
      },
      [theme.breakpoints.up("sm")]: {
        width: "auto",
        maxWidth: "500px",
        padding: theme.spacing(3),
      },
    },
  });
});

const AddWords: React.FC = () => {
  const game = useContext(GameContext);
  const players = useGamePlayers();
  const deviceId = useContext(DeviceIdContext);
  const gameRef = useGameRef();
  const words = useGameWords();
  const { wordsPerPlayer } = game;
  const allWordsAreSet =
    players.length > 0 && players.length * game.wordsPerPlayer <= words.length;

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
  const classes = useStyles();

  useEffect(() => {
    if (allWordsAreSet) {
      handleNext();
    }
  }, [allWordsAreSet]);

  return (
    <ViewWrapper>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        position="relative"
      >
        <Box flex={4} className={classes.leftBox}>
          <H1 className={classes.h1}>Préparez vos boulettes</H1>

          <Typography variant="body1" className={classes.instructions}>
            Chaque joueur sur cet appareil doit entrer ses mots. Ça peut être
            des expressions, des personnes, tout est correct.
          </Typography>

          {/* add words */}
          <Box bgcolor="background.paper" className={classes.wordsWrapper}>
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
          </Box>

          {/* missing words */}
          <NextButton>
            {playersMissingWords.length > 0 && ownerIsOnDevice && (
              <Box>
                <Typography variant="body1">
                  Still waiting for {playersMissingWords.join(", ")}.
                </Typography>
              </Box>
            )}
          </NextButton>
        </Box>

        <Box className={classes.rightBox}>
          <Box
            display="flex"
            justifyContent="center"
            className={classes.imageWrapper}
          >
            <Box maxWidth="350px">
              <img
                width="100%"
                src={writeWords}
                alt="Cartoon boy biting the end of his pencil."
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <WordsSelector
        open={!!wordsModalUser}
        user={wordsModalUser}
        onClose={closeAddWords}
      />
    </ViewWrapper>
  );
};

export default AddWords;
