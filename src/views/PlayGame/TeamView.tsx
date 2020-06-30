import React, { useContext } from "react";
import { Box, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CurrentPlayerView from "./CurrentPlayerView";
import Timer from "./Timer";
import useCurrentPlayerIsOnDevice from "../../hooks/useCurrentPlayerIsOnDevice";
import OtherPlayersView from "./OtherPlayersView";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";

import COPY from "../../copy";

interface IProps {}

const TeamView: React.FC<IProps> = () => {
  const round = useContext(CurrentRoundContext);
  const currentPlayer = round?.currentPlayer;
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  const language = "EN";

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <Box
        mt={3}
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {currentPlayer?.name && (
          <Typography variant="h2" style={{ margin: 0 }}>
            {COPY.TURN_INDICATOR_1[language]} {currentPlayer.name}
            {COPY.TURN_INDICATOR_2[language]}
          </Typography>
        )}
        <Timer />
      </Box>
      {currentPlayerIsOnDevice ? <CurrentPlayerView /> : <OtherPlayersView />}
    </>
  );
};

export default TeamView;
