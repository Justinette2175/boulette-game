import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { SCORE_BOARD_WIDTH } from "../../constants";
import Timer from "./Timer";
import CurrentPlayerView from "./CurrentPlayerView";
import useCurrentPlayerIsOnDevice from "../../utils/useCurrentPlayerIsOnDevice";
import ScoreBoard from "../../components/ScoreBoard";
import { Store } from "../../types";

interface IProps {
  team?: "1" | "2";
}

const TeamView: React.FC<IProps> = ({ team }) => {
  const team1: boolean = team === "1";
  const activeTeam = useSelector((state: Store) => state.game.currentTeam);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      width={matches ? `calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)` : "100vw"}
      position="relative"
      p={4}
      height="100%"
      textAlign={team1 ? "left" : "right"}
    >
      {activeTeam === team && <CurrentPlayerView />}
      {team === "2" && matches && (
        <Box position="absolute" left={`${-SCORE_BOARD_WIDTH / 2}px`} top="0">
          <ScoreBoard />
        </Box>
      )}
    </Box>
  );
};

export default TeamView;
