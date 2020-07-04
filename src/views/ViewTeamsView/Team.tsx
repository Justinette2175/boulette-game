import React, { useEffect, useContext } from "react";
import { Box, Button, Typography, Grid, TextField } from "@material-ui/core";
import PlayerAndAvatar from "../../components/PlayerAndAvatar";
import { useDebouncedAsync, useOwnerIsOnDevice, useGameRef } from "../../hooks";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import COPY from "../../copy";
import { FirebaseGameTeam } from "../../types/firebaseTypes";

interface IProps {
  team: FirebaseGameTeam;
}

const Team: React.FC<IProps> = ({ team }) => {
  const teamPlayers = team.players || {};
  const captain = team.captain;
  const gameRef = useGameRef();
  const deviceId = useContext(DeviceIdContext);

  const setTeamName = async (name: string) => {
    await gameRef.collection("teams").doc(team.id).update({ name });
  };

  const useDebouncedSetTeamName = () =>
    useDebouncedAsync((text: string) => setTeamName(text));

  const { inputText, setInputText } = useDebouncedSetTeamName();

  useEffect(() => {
    setInputText(team.name);
  }, []);

  return (
    <>
      <Box mb={2}>
        {captain?.deviceId === deviceId ? (
          <>
            <Typography variant="h3">{`${captain.name}, chose a name for your team.`}</Typography>
            <TextField
              label="Team name"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </>
        ) : (
          <Typography variant="h3">{team.name || `Team ${team.id}`}</Typography>
        )}
      </Box>

      <Grid container spacing={4}>
        {Object.values(teamPlayers).map((player) => (
          <Grid item key={player.id}>
            <PlayerAndAvatar name={player.name} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Team;
