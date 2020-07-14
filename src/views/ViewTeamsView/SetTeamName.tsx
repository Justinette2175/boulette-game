import React, { useEffect, useContext } from "react";
import {
  Typography,
  InputAdornment,
  FormControl,
  Input,
} from "@material-ui/core";
import { Loader, CheckCircle } from "react-feather";
import { useDebouncedAsync, useGameRef } from "../../hooks";
import DeviceIdContext from "../../contexts/DeviceIdContext";
import { FirebaseGameTeam } from "../../types/firebaseTypes";

interface SetTeamNameProps {
  team: FirebaseGameTeam;
}

const SetTeamName: React.FC<SetTeamNameProps> = ({ team }) => {
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

  return captain?.deviceId === deviceId ? (
    <>
      <Typography variant="body1">{`${captain.name}, chose a name for team ${team.id}.`}</Typography>
      <FormControl>
        <Input
          id="standard-adornment-weight"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Team name"
          endAdornment={
            <InputAdornment position="end">
              {inputText ? (
                !!team.name ? (
                  <CheckCircle size={15} />
                ) : (
                  <Loader size={15} />
                )
              ) : null}
            </InputAdornment>
          }
          aria-describedby={`team-name-${team.id}`}
          inputProps={{
            "aria-label": "Team name",
          }}
        />
      </FormControl>
    </>
  ) : null;
};

export default SetTeamName;
