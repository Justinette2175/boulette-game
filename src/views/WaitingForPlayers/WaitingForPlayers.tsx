import React, { useState, useContext } from "react";
import { UserPlus, ArrowRight } from "react-feather";
import AddPlayerOnComputer from "./AddPlayerOnDevice";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";

import { Button, Box, Typography, Grid, Divider } from "@material-ui/core";
import GameLink from "../../components/GameLink";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";

import COPY from "../../copy";
import { useOwnerIsOnDevice, useGamePlayers } from "../../hooks";
import useGameRef from "../../hooks/useGameRef";

const WaitingForPlayers: React.FC = () => {
  const gameRef = useGameRef();
  const ownerIsOnDevice = useOwnerIsOnDevice();
  const language = "EN";
  const [addPlayerIsVisible, setAddPlayerIsVisible] = useState<boolean>(false);
  const players = useGamePlayers();

  const handleStartGame = () => {
    try {
      gameRef.update({ stage: "CHOSING_WORDS" });
    } catch (e) {
      //
    }
  };

  return (
    <>
      <RemoteCallsStrip />
      <Box py={8} px={4}>
        <Box maxWidth="700px">
          <Typography variant="h1" gutterBottom>
            {COPY.DEVICE_PLAYERS_TITLE[language]}
          </Typography>
          <Box pb={4}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="h4" gutterBottom>
                  Share the link with other players
                </Typography>
                <GameLink />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h4" gutterBottom>
                  Or
                </Typography>
                <Button
                  onClick={() => setAddPlayerIsVisible(true)}
                  startIcon={<UserPlus size={20} />}
                  variant="contained"
                  color="secondary"
                >
                  {COPY.ADD_DEVICE_PLAYER_BUTTON[language]}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider />
          <Box pt={4}>
            <Typography variant="h3" gutterBottom>
              Players
            </Typography>
            <Grid container spacing={1}>
              {players.map((u) =>
                u.name ? (
                  <Grid item xs={12} key={u.id}>
                    <PlayerAndAvatar name={u.name} />
                  </Grid>
                ) : null
              )}
            </Grid>
          </Box>
          <Box my={6}>
            {ownerIsOnDevice && (
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
          <AddPlayerOnComputer
            open={addPlayerIsVisible}
            onClose={() => setAddPlayerIsVisible(false)}
          />
        </Box>
      </Box>
    </>
  );
};

export default WaitingForPlayers;
