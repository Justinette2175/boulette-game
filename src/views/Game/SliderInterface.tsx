import React from "react";
import { Box } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import TeamView from "./TeamView";
import { TeamId } from "../../types";
import SliderWrapper from "../../components/SliderWrapper";
import ScoreBoard from "../../components/ScoreBoard";

interface IProps {
  currentTeamId: TeamId;
  openInstructions: () => void;
}

const SliderInterface: React.FC<IProps> = ({
  currentTeamId,
  openInstructions,
}) => {
  const team1: boolean = currentTeamId === "1";
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      position="relative"
      width="100vw"
      overflow="hidden"
      display="flex"
      height="100vh"
      flexDirection="column"
      zIndex={100}
    >
      {matches && (
        <Box display="flex" width="100%" justifyContent="center">
          <ScoreBoard openInstructions={openInstructions} />
        </Box>
      )}
      <Box flex="1">
        <SliderWrapper
          leftChild={<TeamView team="1" openInstructions={openInstructions} />}
          rightChild={<TeamView team="2" openInstructions={openInstructions} />}
          placement={!currentTeamId ? "center" : team1 ? "left" : "right"}
          displace={!matches}
        />
      </Box>
    </Box>
  );
};

export default SliderInterface;
