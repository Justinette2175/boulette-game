import React from "react";
import { Box } from "@material-ui/core";
import TeamView from "./TeamView";
import { TeamId } from "../../types";
import { SCORE_BOARD_WIDTH, VIDEO_HEIGHT } from "../../constants";
import Jitsy from "../../components/Jitsy";

interface IProps {
  currentTeamId: TeamId;
  jitsyRoomId: string;
}

const SliderInterface: React.FC<IProps> = ({ currentTeamId, jitsyRoomId }) => {
  const team1: boolean = currentTeamId === "1";
  return (
    <Box overflow="hidden" position="relative">
      <Box
        width="200vw"
        display="flex"
        position="relative"
        style={{ transition: "all 1s" }}
        right={
          !currentTeamId
            ? "50%"
            : team1
            ? 0
            : `calc(100vw - ${SCORE_BOARD_WIDTH}px)`
        }
      >
        <TeamView team="1" />
        <TeamView team="2" />
      </Box>

      {/* <Jitsy /> */}
    </Box>
  );
};

export default SliderInterface;
