import React from "react";
import { useSelector } from "react-redux";

import { Box } from "@material-ui/core";
import { SCORE_BOARD_WIDTH } from "../../constants";
import { GRADIENT_AQUA, GRADIENT_ORANGE } from "../../theme";
import { Store } from "../../types";
import Timer from "./Timer";
import CurrentPlayerView from "./CurrentPlayerView";
import useCurrentPlayerIsOnDevice from "../../utils/useCurrentPlayerIsOnDevice";

interface IProps {
  team?: "1" | "2";
}

const TeamView: React.FC<IProps> = ({ team }) => {
  const team1: boolean = team === "1";
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  return (
    <Box
      width={`calc(100vw - ${SCORE_BOARD_WIDTH / 2}px)`}
      height="100vh"
      style={{ backgroundImage: team1 ? GRADIENT_AQUA : GRADIENT_ORANGE }}
      textAlign={team1 ? "left" : "right"}
    >
      <Timer />
      {currentPlayerIsOnDevice && <CurrentPlayerView />}
    </Box>
  );
};

export default TeamView;
