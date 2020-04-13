import React from "react";
import { useSelector } from "react-redux";
import { Store, User, TeamId, Team } from "../../types";
import { Box, Typography } from "@material-ui/core";
import { WORDS_PER_PLAYER } from "../../constants";
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

  if (!team1 || !team2) {
    return null;
  }

  return (
    <Box py={4}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h1" align="center">
          Prepare teams and words
        </Typography>
        <Typography variant="body1" align="center">
          Assign players to two teams of equal size. Have each player chose{" "}
          {WORDS_PER_PLAYER} words to put in the bowl. Once that's done, the
          game owner will start the game.
        </Typography>
      </Box>
      <Box width="100%" display="flex" justifyContent="center" mt={2}>
        <Box
          mr={1}
          width="300px"
          height="500px"
          overflow="auto"
          style={{ backgroundImage: GRADIENT_AQUA }}
          p={2}
        >
          <Box mb={2}>
            <Typography variant="h3" align="center" style={{ color: "white" }}>
              {team1.name}
            </Typography>
          </Box>
          {renderTeamUsers("1")}
        </Box>
        <Box
          p={2}
          mr={1}
          ml={1}
          mb={1}
          width="400px"
          height="500px"
          overflow="auto"
          style={{ border: "1px solid black" }}
        >
          <Typography variant="h3" align="center">
            Teamless Players
          </Typography>
          <Typography variant="body1" align="center">
            Assign all of the players to teams of equal size to start the game.
          </Typography>
          {renderTeamUsers(null)}
        </Box>
        <Box
          p={2}
          ml={1}
          width="300px"
          height="500px"
          overflow="auto"
          style={{ backgroundImage: GRADIENT_ORANGE }}
        >
          <Typography variant="h3" align="center" style={{ color: "white" }}>
            {team2.name}
          </Typography>
          {renderTeamUsers("2")}
        </Box>
      </Box>
    </Box>
  );
};

export default TeamsSelector;
