import React, { useEffect } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { Store, GameStages } from "./types";
import Cookies from "js-cookie";
import { addUserToComputer } from "./redux/computer";

import { CssBaseline, Box } from "@material-ui/core";
import { JitsiProvider } from "./utils/JitsiContext";

import StartOrJoinGame from "./views/StartOrJoinGame";
import AddWordsView from "./views/AddWordsView";
import Game from "./views/Game";
import Background from "./components/Background";
import GameEnded from "./views/GameEnded";
import WaitingForPlayersView from "./views/WaitingForPlayersView";
import EndGame from "./components/EndGame";

import GameService from "./services/game";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const gameId = useSelector((state: Store) => state.game.id);
  const gameStage: GameStages = useSelector((state: Store) => state.game.stage);
  const storedGameId = Cookies.get("gameId");
  const storedUsers: Array<string> = Cookies.getJSON("users");

  useEffect(() => {
    if (storedGameId) {
      GameService.loadGame(storedGameId);
    }
    if (storedUsers) {
      storedUsers.forEach((u) => dispatch(addUserToComputer(u)));
    }
  }, []);

  let view;
  if (storedGameId && !gameId) {
    view = null;
  } else if (!gameId) {
    view = <StartOrJoinGame />;
  } else if (gameStage === "WAITING_FOR_PLAYERS") {
    view = <WaitingForPlayersView />;
  } else if (gameStage === "CHOSING_WORDS") {
    view = <AddWordsView />;
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
          {gameId && <EndGame />}
        </>
      </JitsiProvider>
    </div>
  );
};

export default App;
