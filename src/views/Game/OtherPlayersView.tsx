import React from "react";
import { useSelector } from "react-redux";
import { Box, useTheme, Typography, Grid } from "@material-ui/core";
import CurrentPlayerVideo from "./CurrentPlayerVideo";
import { Store, User } from "../../types";
import UserAvatar from "../../components/UserAvatar";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";

interface IProps {
  teamId: string;
}

const OtherPlayersView: React.FC<IProps> = ({ teamId }) => {
  const theme = useTheme();
  const guessingPlayers = useSelector((state: Store) => {
    if (state.game.currentUser) {
      const users = state.game.users;
      return users.filter((u) => {
        return u.teamId === teamId && u.id !== state.game.currentUser;
      });
    }
    return [];
  });

  return (
    <Box
      flexGrow={1}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      marginX={`-${theme.spacing(4)}px`}
      marginBottom={`-${theme.spacing(6)}px`}
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h3" align="center">
          The following players can guess the word
        </Typography>
        <Box my={2}>
          <Grid container spacing={2}>
            {guessingPlayers.map((p) => (
              <Grid item>
                <PlayerAndAvatar name={p.name} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <CurrentPlayerVideo />
    </Box>
  );
};

export default OtherPlayersView;
