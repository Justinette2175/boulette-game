import React, { useEffect, useState } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { Store, GameStages } from "./types";
import Cookies from "js-cookie";
import { addUserToComputer } from "./redux/computer";

import {
  CssBaseline,
  Box,
  useMediaQuery,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { JitsiProvider } from "./utils/JitsiContext";

import StartOrJoinGame from "./views/StartOrJoinGame";
import AddWordsView from "./views/AddWordsView";
import Game from "./views/Game";
import Background from "./components/Background";
import GameEnded from "./views/GameEnded";
import WaitingForPlayersView from "./views/WaitingForPlayersView";
import ViewTeamsView from "./views/ViewTeamsView";
import SmallScreenView from "./views/SmallScreenView";

import PermissionsModal from "./components/PermissionsModal";

import GameService from "./services/game";
import SettingsContainer from "./components/SettingsContainer";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const gameId = useSelector((state: Store) => state.game.id);
  const gameStage: GameStages = useSelector((state: Store) => state.game.stage);
  const storedGameId = Cookies.get("gameId");
  const storedUsers: Array<string> = Cookies.getJSON("users");

  const [urlGameId, setUrlGameId] = useState<string>(null);

  const loadStored = () => {
    if (storedGameId) {
      GameService.loadGame(storedGameId);
    }
    if (storedUsers) {
      storedUsers.forEach((u) => dispatch(addUserToComputer(u)));
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (
      urlParams &&
      urlParams.get("gameId") &&
      urlParams.get("gameId") !== storedGameId
    ) {
      setUrlGameId(urlParams.get("gameId"));
    } else {
      setUrlGameId(storedGameId || "");
      loadStored();
    }
  }, []);

  const theme = useTheme();

  const isSmallScreen = useMediaQuery((t: Theme) => t.breakpoints.down("sm"));

  let view;
  if (isSmallScreen) {
    view = <SmallScreenView />;
  } else if (!gameId && urlGameId !== null && urlGameId !== storedGameId) {
    view = <StartOrJoinGame gameId={urlGameId} />;
  } else if (gameStage === "WAITING_FOR_PLAYERS") {
    view = <WaitingForPlayersView />;
  } else if (gameStage === "CHOSING_WORDS") {
    view = <AddWordsView />;
  } else if (gameStage === "REVIEWING_TEAMS") {
    view = <ViewTeamsView />;
  } else if (gameStage === "ENDED") {
    view = <GameEnded />;
  } else if (gameStage === "PLAYING") {
    view = <Game />;
  }

  return (
    <div className="App">
      <JitsiProvider gameId={gameId}>
        <>
          <CssBaseline />
          <Background />
          <Box
            style={{
              position: "relative",
              minHeight: "100vh",
              width: "100vw",
              overflow: "auto",
            }}
          >
            {view}
          </Box>
          <SettingsContainer />
          <PermissionsModal />
        </>
      </JitsiProvider>
    </div>
  );
};

export default App;
