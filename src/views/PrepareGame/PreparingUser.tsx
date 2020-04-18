import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Store, Username, User, Word, TeamId } from "../../types";
import { Button, Box, Typography } from "@material-ui/core";
import { PlaylistAdd } from "@material-ui/icons";

import { userStillHasWordsToWrite } from "../../utils";

interface IProps {
  user: User;
  onOpenAddWords: (u: User) => void;
  hasTeam?: boolean;
}

const PreparingUser: React.FC<IProps> = ({ user, onOpenAddWords, hasTeam }) => {
  const gameWords: Array<Word> = useSelector(
    (state: Store) => state.game.words
  );

  const computerUsers: Array<Username> = useSelector(
    (state: Store) => state.computer.users
  );

  const userIsOnComputer = computerUsers.indexOf(user.id) > -1;

  return (
    <>
      <Box
        paddingY="5px"
        display="flex"
        p={1}
        mb={1}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h4"
          component="p"
          style={{ color: hasTeam ? "white" : "inherit" }}
        >
          {user.name}
        </Typography>
        {userIsOnComputer && userStillHasWordsToWrite(gameWords, user) && (
          <Button
            size="small"
            onClick={() => onOpenAddWords(user)}
            variant="contained"
            color="secondary"
            startIcon={<PlaylistAdd fontSize="small" />}
          >
            Words
          </Button>
        )}
      </Box>
    </>
  );
};

export default PreparingUser;
