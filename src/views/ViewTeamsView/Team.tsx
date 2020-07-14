import React, { useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  Input,
  FormHelperText,
} from "@material-ui/core";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";
import { Loader, CheckCircle } from "react-feather";
import { useDebouncedAsync, useOwnerIsOnDevice, useGameRef } from "../../hooks";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import COPY from "../../copy";
import { FirebaseGameTeam } from "../../types/firebaseTypes";

interface IProps {
  team: FirebaseGameTeam;
}

const Team: React.FC<IProps> = ({ team }) => {
  const teamPlayers = team.players || {};

  return (
    <>
      <Box mb={2}>
        <Typography variant="h3" gutterBottom>
          Team {team.id}
        </Typography>
        {team.name && <Typography variant="h4">{team.name}</Typography>}
      </Box>

      <Grid container spacing={2}>
        {Object.values(teamPlayers).map((player) => (
          <Grid item key={player.id} xs={12}>
            <PlayerAndAvatar name={player.name} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Team;
