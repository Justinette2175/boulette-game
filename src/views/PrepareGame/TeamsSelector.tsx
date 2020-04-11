import React from "react";
import { useSelector } from "react-redux";
import { Store, User, TeamId, Team } from "../../types";
import { Box, Typography } from "@material-ui/core";

import PreparingUser from "./PreparingUser";

interface IProps {
  onOpenAddWords: (u: User) => void;
}

const TeamsSelector: React.FC<IProps> = ({ onOpenAddWords }) => {
  const gameUsers: Array<User> = useSelector(
    (state: Store) => state.game.users
  );
  const teams: Array<Team> = useSelector((state: Store) => state.game.teams);
  const team1 = teams.find((t) => t.id === "1");
  const team2 = teams.find((t) => t.id === "2");

  const renderTeamUsers = (teamId?: TeamId) => {
    return gameUsers
      .filter((u) => (teamId ? teamId === u.teamId : !u.teamId))
      .map((u) => (
        <PreparingUser key={u.name} user={u} onOpenAddWords={onOpenAddWords} />
      ));
  };

  if (!team1 || !team2) {
    return null;
  }

  return (
    <Box display="flex" justifyContent="space-between">
      <Box flex="1" mr={1}>
        <Typography variant="h4">{team1.name}</Typography>
        {renderTeamUsers("1")}
      </Box>
      <Box flex="1" mr={1} ml={1}>
        <Typography variant="h4">Teamless Players</Typography>
        {renderTeamUsers(null)}
      </Box>
      <Box flex="1" ml={1}>
        <Typography variant="h4">{team2.name}</Typography>
        {renderTeamUsers("2")}
      </Box>
    </Box>
  );
};

export default TeamsSelector;
