import React, { useContext } from "react";
import { Box, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CurrentPlayerView from "./CurrentPlayerView";
import Timer from "./Timer";
import useCurrentPlayerIsOnDevice from "../../hooks/useCurrentPlayerIsOnDevice";
import OtherPlayersView from "./OtherPlayersView";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";
import { LighterBox } from "../../components/Containers";
import COPY from "../../copy";

interface IProps {}

const TeamView: React.FC<IProps> = () => {
  const round = useContext(CurrentRoundContext);
  const currentPlayer = round?.currentPlayer;
  const currentPlayerIsOnDevice = useCurrentPlayerIsOnDevice();
  const language = "EN";

  const theme = useTheme();

  return (
    <>
      <Box
        mt={2}
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <LighterBox>
          {currentPlayer?.name && (
            <Typography variant="h2" align="center" style={{ margin: 0 }}>
              {COPY.TURN_INDICATOR_1[language]} {currentPlayer.name}
              {COPY.TURN_INDICATOR_2[language]}
            </Typography>
          )}
          <Timer />
        </LighterBox>
      </Box>
      {currentPlayerIsOnDevice ? <CurrentPlayerView /> : <OtherPlayersView />}
    </>
  );
};

export default TeamView;
