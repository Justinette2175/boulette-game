import React from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { Store } from "./types";

import { CssBaseline, Box } from "@material-ui/core";

import StartOrJoinGame from "./views/StartOrJoinGame";
import PrepareGame from "./views/PrepareGame";
import Game from "./views/Game";
import Background from "./components/Background";

const App: React.FC = () => {
  const gameId = useSelector((state: Store) => state.game.id);
  const gameStarted: boolean = useSelector(
    (state: Store) => !!state.game.currentRound
  );

  let view;
  if (!gameId) {
    view = <StartOrJoinGame />;
  } else if (!gameStarted) {
    view = <PrepareGame />;
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
          padding: "30px",
          height: "100vh",
          width: "100vw",
          overflow: "auto",
        }}
      >
        {view}
      </Box>
    </div>
  );
};

export default App;
