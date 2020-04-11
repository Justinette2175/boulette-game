import React from "react";
import "./App.css";
import { useSelector } from "react-redux";
import { Store } from "./types";

import { CssBaseline, Container } from "@material-ui/core";

import StartOrJoinGame from "./views/StartOrJoinGame";
import PrepareGame from "./views/PrepareGame";
import Game from "./views/Game";

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
      <Container maxWidth="md">{view}</Container>
    </div>
  );
};

export default App;
