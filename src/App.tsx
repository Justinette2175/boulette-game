import React, { useEffect } from "react";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { Store } from "./types";
import Cookies from "js-cookie";
import { addUserToComputer } from "./redux/computer";

import { CssBaseline, Box } from "@material-ui/core";

import StartOrJoinGame from "./views/StartOrJoinGame";
import PrepareGame from "./views/PrepareGame";
import Game from "./views/Game";
import Background from "./components/Background";
import GameEnded from "./views/GameEnded";
import JitsyNew from "./components/JitsyNew";
import CallInterface from "./components/CallInterface";
import EndGame from "./components/EndGame";

import GameService from "./services/game";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const gameId = useSelector((state: Store) => state.game.id);
  const gameStarted: boolean = useSelector(
    (state: Store) => !!state.game.currentRound
  );
  const gameEnded = useSelector((state: Store) => !!state.game.winner);
  const storedGameId = Cookies.get("gameId");
  const storedUsers: Array<string> = Cookies.getJSON("users");
  let j;

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
  } else if (!gameStarted) {
    view = <PrepareGame />;
  } else if (gameEnded) {
    view = <GameEnded />;
  } else {
    view = <Game />;
  }

  return (
    <div className="App">
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
        {/* {gameId && <JitsyNew />} */}
        <Box id="video"></Box>
      </Box>
      {gameId && <CallInterface jitsy={j} />}
      {gameId && <EndGame />}
    </div>
  );
};

export default App;
