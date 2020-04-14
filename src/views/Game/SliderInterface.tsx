import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@material-ui/core";
import TeamView from "./TeamView";
import { Store, Team, TeamId } from "../../types";
import { SCORE_BOARD_WIDTH } from "../../constants";

interface IProps {
  currentTeamId: TeamId;
}

const SliderInterface: React.FC<IProps> = ({ currentTeamId }) => {
  const team1: boolean = currentTeamId === "1";
  return (
    <Box overflow="hidden">
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
    </Box>
  );
};

export default SliderInterface;
