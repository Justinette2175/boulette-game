import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Store, User } from "../../types";
import GameService from "../../services/game";
import { UserPlus, ArrowRight } from "react-feather";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";
import AddPlayerOnComputer from "./AddPlayerOnComputer";

import { Button, Box, Typography, useTheme, Grid } from "@material-ui/core";
import CallWrapper from "../../components/CallWrapper";
import LocalCall from "../../components/LocalCall";
import useComputerUsers from "../../utils/useComputerUsers";
import UserAvatar from "../../components/UserAvatar";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";

const PrepareGame: React.FC = () => {
  const gameOwner = useSelector((state: Store) => state.game.owner);
  const computerUserIds = useSelector((state: Store) => state.computer.users);
  const ownerIsOnComputer = computerUserIds.indexOf(gameOwner) > -1;
  const computerUsers = useComputerUsers();

  const [addPlayerIsVisible, setAddPlayerIsVisible] = useState<boolean>(false);

  const handleStartGame = () => {
    GameService.choseWords();
  };

  const theme = useTheme();

  return (
    <Box my={6}>
      <Box mx={6}>
        <Typography variant="h1">Waiting room</Typography>
      </Box>
      <Box
        mt={4}
        px={6}
        py={4}
        style={{ backgroundColor: theme.palette.primary.light }}
      >
        <Box display="flex">
          <Box display="flex" justifyContent="center">
            <CallWrapper usersOnThatJitsi={computerUsers} showNames={false}>
              <LocalCall />
            </CallWrapper>
          </Box>
          <Box ml={4}>
            <Grid container spacing={4}>
              {computerUsers.map((u) => (
                <Grid item>
                  <PlayerAndAvatar name={u.name} />
                </Grid>
              ))}
            </Grid>
            <Typography variant="body1" gutterBottom>
              Only use one device per location. Add any players next to you to
              this device.
            </Typography>
            <Button
              onClick={() => setAddPlayerIsVisible(true)}
              startIcon={<UserPlus size={20} />}
              variant="outlined"
            >
              Add a player on this device
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        px={6}
        py={4}
        style={{ backgroundColor: theme.palette.secondary.light }}
      >
        <Typography variant="h2" gutterBottom>
          Remote players
        </Typography>
        <RemoteCallsStrip />
        <Box display="flex" alignItems="center" flexDirection="column" my={4}>
          <Box mb={2} maxWidth="300px">
            <Typography variant="body2" align="center">
              {ownerIsOnComputer
                ? "When all the players have joined, start the game."
                : "The owner of this game room will start the game once everyone's here."}
            </Typography>
          </Box>
          {ownerIsOnComputer && (
            <Button
              onClick={handleStartGame}
              color="primary"
              variant="contained"
              startIcon={<ArrowRight />}
            >
              Start the game!
            </Button>
          )}
        </Box>
      </Box>
      <AddPlayerOnComputer
        open={addPlayerIsVisible}
        onClose={() => setAddPlayerIsVisible(false)}
      />
    </Box>
  );
};

export default PrepareGame;
