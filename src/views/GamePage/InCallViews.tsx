import React, { useContext } from "react";

import { Box, useMediaQuery } from "@material-ui/core";

import AddWords from "../AddWords";
import PlayGame from "../PlayGame";
import GameEnded from "../GameEnded";
import WaitingForPlayers from "../WaitingForPlayers";
import ViewTeamsView from "../ViewTeamsView";

import GameContext from "../../contexts/GameContext";
import TeamsContext from "../../contexts/TeamsContext";
import DisplayVideoContext from "../../contexts/DisplayVideoContext";
import TwillioWrapper from "./TwillioWrapper";
import { useGameTeams } from "../../hooks";
import RemoteCallsStrip from "../../components/RemoteCallsStrip";

interface IProps {}

const InCallViews: React.FC<IProps> = () => {
  const game = useContext(GameContext);
  const teams = useGameTeams();

  const [displayVideo] = useContext(DisplayVideoContext);

  let view;
  if (game && game.stage === "WAITING_FOR_PLAYERS") {
    view = <WaitingForPlayers />;
  } else if (game && game.stage === "CHOSING_WORDS") {
    view = <AddWords />;
  } else if (game && game.stage === "REVIEWING_TEAMS") {
    view = <ViewTeamsView />;
  } else if (game && game.stage === "ENDED") {
    view = <GameEnded />;
  } else if (game && game.stage === "PLAYING") {
    view = <PlayGame />;
  }

  const matches = useMediaQuery((theme: any) => theme.breakpoints.up("md"));

  return (
    <TwillioWrapper>
      <TeamsContext.Provider value={teams || []}>
        <Box
          display="flex"
          flex={1}
          flexDirection={matches ? "row-reverse" : "column"}
          alignItems="stretch"
        >
          <Box
            style={{ backgroundColor: "black" }}
            overflow="auto"
            maxWidth="100%"
            maxHeight={displayVideo ? "auto" : 0}
          >
            {displayVideo && (
              <RemoteCallsStrip direction={matches ? "column" : "row"} />
            )}
          </Box>
          {view}
        </Box>
      </TeamsContext.Provider>
    </TwillioWrapper>
  );
};

export default InCallViews;
