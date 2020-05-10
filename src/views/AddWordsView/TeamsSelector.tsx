import React from "react";
import { useSelector } from "react-redux";
import { Store, User, TeamId, Team } from "../../types";
import { Box, Typography, Button } from "@material-ui/core";
import { GRADIENT_AQUA, GRADIENT_ORANGE } from "../../theme";

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
      .map((u, i) => (
        <PreparingUser
          key={u.name}
          user={u}
          onOpenAddWords={onOpenAddWords}
          hasTeam={!!teamId}
        />
      ));
  };

  const renderTeamColumn = (team: Team, index: string) => {
    const isTeam1 = index === "1";
    return (
      <Box
        mr={1}
        width="300px"
        height="400px"
        overflow="auto"
        style={{ backgroundImage: isTeam1 ? GRADIENT_AQUA : GRADIENT_ORANGE }}
        p={2}
      >
        {team && (
          <>
            <Box mb={2}>
              <Typography
                variant="caption"
                align="center"
                style={{ display: "block" }}
              >
                Team {index}
              </Typography>
              <Typography variant="h3" align="center">
                {team.name}
              </Typography>
            </Box>
            {renderTeamUsers(team.id)}
          </>
        )}
      </Box>
    );
  };

  return (
    <Box pb={4}>
      <Box width="100%" display="flex" justifyContent="center" mt={2}>
        {renderTeamColumn(team1, "1")}
        {renderTeamColumn(team2, "2")}
      </Box>
    </Box>
  );
};

export default TeamsSelector;
