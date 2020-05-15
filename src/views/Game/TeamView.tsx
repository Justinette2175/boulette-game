import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { SCORE_BOARD_WIDTH } from "../../constants";
import CurrentPlayerView from "./CurrentPlayerView";
import ScoreBoard from "../../components/ScoreBoard";
import Timer from "./Timer";
import { Store, User } from "../../types";
import useCurrentPlayerIsOnDevice from "../../utils/useCurrentPlayerIsOnDevice";
import OtherPlayersView from "./OtherPlayersView";

import COPY from "../../copy";

interface IProps {
  team?: "1" | "2";
}

const TeamView: React.FC<IProps> = ({ team }) => {
  const team1: boolean = team === "1";
  const activeTeam = useSelector((state: Store) => state.game.currentTeam);
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  const language = useSelector((state: Store) => state.computer.language);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const currentPlayer = useSelector((state: Store) => {
    if (state.game.currentUser) {
      const user: User = state.game.users.find(
        (u) => u.id === state.game.currentUser
      );
      return user || {};
    }
    return null;
  });

  return (
    <Box
      width={matches ? `calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)` : "100vw"}
      position="relative"
      p={4}
      height="100%"
      display="flex"
      flexDirection="column"
      // textAlign={team1 ? "left" : "right"}
    >
      {activeTeam === team && (
        <>
          <Box
            width="100%"
            textAlign="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {currentPlayer.name && (
              <Typography variant="h2">
                {COPY.TURN_INDICATOR_1[language]} {currentPlayer.name}
                {COPY.TURN_INDICATOR_2[language]}
              </Typography>
            )}
            <Timer />
          </Box>
          {activeTeam === team && currentPlayerIsOnDevice && (
            <CurrentPlayerView />
          )}
          {activeTeam === team && !currentPlayerIsOnDevice && (
            <OtherPlayersView teamId={team} />
          )}
        </>
      )}
      {team === "2" && matches && (
        <Box position="absolute" left={`${-SCORE_BOARD_WIDTH / 2}px`} top="0">
          <ScoreBoard />
        </Box>
      )}
    </Box>
  );
};

export default TeamView;
