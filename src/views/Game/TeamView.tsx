import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
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
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  const activeTeam = useSelector((state: Store) => state.game.currentTeam);
  return (
    <Box
      width={`calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)`}
      height="100vh"
      position="relative"
      p={4}
      textAlign={team1 ? "left" : "right"}
    >
      {activeTeam === team && (
        <Box>
          <Timer />
          {currentPlayerIsOnDevice && <CurrentPlayerView />}
        </Box>
      )}
      {team === "2" && (
        <Box position="absolute" left={`${-SCORE_BOARD_WIDTH / 2}px`} top="0">
          <ScoreBoard />
        </Box>
      )}
    </Box>
  );
};

export default TeamView;
