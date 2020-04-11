import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Store, Username, User, Team, Word, TeamId } from "../../types";
import { Button, Box, Typography } from "@material-ui/core";
import { assignUserToTeam } from "../../redux/game";

import { userStillHasWordsToWrite } from "../../utils";

interface IProps {
  user: User;
  onOpenAddWords: (u: User) => void;
}

const PreparingUser: React.FC<IProps> = ({ user, onOpenAddWords }) => {
  const dispatch = useDispatch();
  const gameWords: Array<Word> = useSelector(
    (state: Store) => state.game.words
  );

  const computerUsers: Array<Username> = useSelector(
    (state: Store) => state.computer.users
  );

  const userIsOnComputer = computerUsers.indexOf(user.id) > -1;

  const assignToTeam = (teamId: TeamId) => {
    dispatch(assignUserToTeam(user.id, teamId));
  };

  return (
    <Box display="flex">
      {userIsOnComputer && user.teamId !== "1" && (
        <Button onClick={() => assignToTeam("1")}>Assign to team 1</Button>
      )}
      <Box flexGrow="1">
        <Typography variant="body1">{user.name}</Typography>
      </Box>
      {userIsOnComputer && userStillHasWordsToWrite(gameWords, user) && (
        <Button onClick={() => onOpenAddWords(user)}>Add words</Button>
      )}
      {userIsOnComputer && user.teamId !== "2" && (
        <Button onClick={() => assignToTeam("2")}>Assign to team 2</Button>
      )}
    </Box>
  );
};

export default PreparingUser;
