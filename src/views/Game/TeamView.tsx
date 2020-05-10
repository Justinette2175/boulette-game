import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { SCORE_BOARD_WIDTH } from "../../constants";
import CurrentPlayerView from "./CurrentPlayerView";
import ScoreBoard from "../../components/ScoreBoard";
import Timer from "./Timer";
import { Store } from "../../types";
import useCurrentPlayerIsOnDevice from "../../utils/useCurrentPlayerIsOnDevice";
import OtherPlayersView from "./OtherPlayersView";

interface IProps {
  team?: "1" | "2";
}

const TeamView: React.FC<IProps> = ({ team }) => {
  const team1: boolean = team === "1";
  const activeTeam = useSelector((state: Store) => state.game.currentTeam);
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      width={matches ? `calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)` : "100vw"}
      position="relative"
      p={4}
      height="100%"
      display="flex"
      flexDirection="column"
      textAlign={team1 ? "left" : "right"}
    >
      <Timer />
      {activeTeam === team && currentPlayerIsOnDevice && <CurrentPlayerView />}
      {activeTeam === team && !currentPlayerIsOnDevice && <OtherPlayersView />}
      {team === "2" && matches && (
        <Box position="absolute" left={`${-SCORE_BOARD_WIDTH / 2}px`} top="0">
          <ScoreBoard />
        </Box>
      )}
    </Box>
  );
};

export default TeamView;
