import React from "react";
import { Box } from "@material-ui/core";
import TeamView from "./TeamView";
import { TeamId } from "../../types";
import SliderWrapper from "../../components/SliderWrapper";

interface IProps {
  currentTeamId: TeamId;
}

const SliderInterface: React.FC<IProps> = ({ currentTeamId }) => {
  const team1: boolean = currentTeamId === "1";
  return (
    <Box position="relative">
      <SliderWrapper
        leftChild={<TeamView team="1" />}
        rightChild={<TeamView team="2" />}
        placement={!currentTeamId ? "center" : team1 ? "left" : "right"}
      />
    </Box>
  );
};

export default SliderInterface;
