import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Store, Username, User, Word, TeamId } from "../../types";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@material-ui/core";
import { ChevronRight, ChevronLeft, PlaylistAdd } from "@material-ui/icons";

import { assignUserToTeam } from "../../redux/game";

import { userStillHasWordsToWrite } from "../../utils";
import { GRADIENT_AQUA, GRADIENT_ORANGE } from "../../theme";

interface IProps {
  user: User;
  onOpenAddWords: (u: User) => void;
  hasTeam?: boolean;
}

const PreparingUser: React.FC<IProps> = ({ user, onOpenAddWords, hasTeam }) => {
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
    <>
      <Box
        paddingY="5px"
        borderTop={"1px solid"}
        borderColor={hasTeam ? "white" : "black"}
      >
        <Typography
          variant="body1"
          align="center"
          style={{ color: hasTeam ? "white" : "inherit" }}
        >
          {user.name}
        </Typography>
        {userIsOnComputer && (
          <Box
            width="100%"
            display="flex"
            mt={1}
            justifyContent="space-between"
          >
            <Box flex="1">
              {user.teamId !== "1" && (
                <IconButton
                  onClick={() => assignToTeam("1")}
                  size="small"
                  style={{
                    marginRight: "10px",
                    backgroundImage: GRADIENT_AQUA,
                  }}
                >
                  <ChevronLeft style={{ color: "white" }} />
                </IconButton>
              )}
            </Box>
            {userStillHasWordsToWrite(gameWords, user) && (
              <Button
                size="small"
                onClick={() => onOpenAddWords(user)}
                variant="contained"
                color="primary"
                startIcon={<PlaylistAdd fontSize="small" />}
              >
                Words
              </Button>
            )}

            <Box alignSelf="flex-end" flex="1" style={{ textAlign: "right" }}>
              {user.teamId !== "2" && (
                <IconButton
                  size="small"
                  onClick={() => assignToTeam("2")}
                  style={{
                    marginLeft: "10px",
                    backgroundImage: GRADIENT_ORANGE,
                  }}
                >
                  <ChevronRight style={{ color: "white" }} />
                </IconButton>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PreparingUser;
