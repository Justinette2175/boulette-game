import React from "react";
import { useSelector } from "react-redux";
import { Store, User, TeamId, Team } from "../../types";
import { Box, Typography, Button } from "@material-ui/core";
import { NEON_GREEN } from "../../theme";
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

  return (
    <Box pb={4}>
      <Box width="100%" display="flex" justifyContent="center" mt={2}>
        <Box
          mr={1}
          width="300px"
          height="400px"
          overflow="auto"
          style={{ backgroundImage: GRADIENT_AQUA }}
          p={2}
        >
          <Box mb={2}>
            <Typography
              variant="caption"
              align="center"
              style={{ color: NEON_GREEN, display: "block" }}
            >
              Team 1
            </Typography>
            <Typography
              variant="h3"
              align="center"
              style={{ color: NEON_GREEN }}
            >
              {team1 ? team1.name : ""}
            </Typography>
          </Box>
          {renderTeamUsers("1")}
        </Box>
        <Box
          p={2}
          ml={1}
          width="300px"
          height="400px"
          overflow="auto"
          style={{ backgroundImage: GRADIENT_ORANGE }}
        >
          <Typography
            variant="caption"
            align="center"
            style={{ color: NEON_GREEN, display: "block" }}
          >
            Team 2
          </Typography>
          <Typography variant="h3" align="center" style={{ color: NEON_GREEN }}>
            {team2 ? team2.name : ""}
          </Typography>
          {renderTeamUsers("2")}
        </Box>
      </Box>
    </Box>
  );
};

export default TeamsSelector;
