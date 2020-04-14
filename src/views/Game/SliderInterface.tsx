import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import TeamView from "./TeamView";
import { Store, Team, TeamId } from "../../types";
import { SCORE_BOARD_WIDTH, VIDEO_HEIGHT } from "../../constants";
import Jitsy from "../../components/Jitsy";

interface IProps {
  currentTeamId: TeamId;
  jitsyRoomId: string;
}

const SliderInterface: React.FC<IProps> = ({ currentTeamId, jitsyRoomId }) => {
  const team1: boolean = currentTeamId === "1";
  const switching = useState<boolean>(false);
  useEffect(() => {}, [team1]);
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
      <Box
        position="absolute"
        width={`calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)`}
        height={VIDEO_HEIGHT}
        bottom={0}
        left={team1 ? 0 : `${SCORE_BOARD_WIDTH / 2}px`}
        style={{ backgroundColor: "black" }}
        display="flex"
        justifyContent="center"
      >
        {jitsyRoomId && (
          <Jitsy jitsyRoomId={jitsyRoomId} deviceName="Justine" />
        )}
      </Box>
    </Box>
  );
};

export default SliderInterface;
