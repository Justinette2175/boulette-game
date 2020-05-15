import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Store } from "../../types";
import GameService from "../../services/game";
import { UserPlus, ArrowRight } from "react-feather";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";
import AddPlayerOnComputer from "./AddPlayerOnComputer";

import { Button, Box, Typography, Grid } from "@material-ui/core";
import CallWrapper from "../../components/CallWrapper";
import LocalCall from "../../components/LocalCall";
import useComputerUsers from "../../utils/useComputerUsers";
import GameLink from "../../components/GameLink";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";

import ContentWrapper from "../../components/ContentWrapper";

import COPY from "../../copy";

const PrepareGame: React.FC = () => {
  const gameOwner = useSelector((state: Store) => state.game.owner);
  const computerUserIds = useSelector((state: Store) => state.computer.users);
  const ownerIsOnComputer = computerUserIds.indexOf(gameOwner) > -1;
  const computerUsers = useComputerUsers();
  const language = useSelector((state: Store) => state.computer.language);
  const [addPlayerIsVisible, setAddPlayerIsVisible] = useState<boolean>(false);

  const handleStartGame = () => {
    GameService.choseWords();
  };

  return (
    <>
      <ContentWrapper
        leftChild={
          <>
            <Typography variant="h2" gutterBottom>
              {COPY.DEVICE_PLAYERS_TITLE[language]}
            </Typography>
            <Box display="flex" mt={4}>
              <CallWrapper usersOnThatJitsi={computerUsers} showNames={false}>
                <LocalCall />
              </CallWrapper>
              <Box ml={4}>
                <Grid container spacing={2}>
                  {computerUsers.map((u) => (
                    <Grid item>
                      <PlayerAndAvatar name={u.name} />
                    </Grid>
                  ))}
                </Grid>
                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    {COPY.ADD_DEVICE_PLAYER_INSTRUCTIONS[language]}
                  </Typography>
                  <Button
                    onClick={() => setAddPlayerIsVisible(true)}
                    startIcon={<UserPlus size={20} />}
                    variant="outlined"
                  >
                    {COPY.ADD_DEVICE_PLAYER_BUTTON[language]}
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        }
        rightChild={
          <>
            <Typography variant="h2" gutterBottom>
              {COPY.REMOTE_PLAYERS_TITLE[language]}
            </Typography>
            <Box mt={4}>
              <RemoteCallsStrip />
              <GameLink mt={4} />
              <Box my={6}>
                <Box mb={2} maxWidth="300px">
                  <Typography variant="h4" component="p">
                    {ownerIsOnComputer
                      ? COPY.NEXT_JOIN_PLAYERS_INSTRUCTIONS[language]
                      : COPY.JOIN_PLAYERS_WAIT_INSTRUCTIONS[language]}
                  </Typography>
                </Box>
                {ownerIsOnComputer && (
                  <Button
                    onClick={handleStartGame}
                    color="primary"
                    variant="contained"
                    endIcon={<ArrowRight />}
                  >
                    {COPY.JOIN_PLAYERS_NEXT_BUTTON[language]}
                  </Button>
                )}
              </Box>
            </Box>
          </>
        }
      />
      <AddPlayerOnComputer
        open={addPlayerIsVisible}
        onClose={() => setAddPlayerIsVisible(false)}
      />
    </>
  );
};

export default PrepareGame;
