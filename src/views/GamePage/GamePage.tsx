import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../../firebase";

import { FirebaseGame } from "../../types/firebaseTypes";

import StartOrJoinGame from "../../views/StartOrJoinGame";
import AddWordsView from "../../views/AddWordsView";
import Game from "../../views/Game";
import Background from "../../components/Background";
import GameEnded from "../../views/GameEnded";
import WaitingForPlayersView from "../../views/WaitingForPlayersView";
import ViewTeamsView from "../../views/ViewTeamsView";

import GameContext from "../../contexts/GameContext";
import { Redirect } from "react-router-dom";

interface GamePageProps {
  match: { params: { gameId: string } };
}

const GamePage: React.FC<GamePageProps> = ({
  match: {
    params: { gameId },
  },
}) => {
  const [game, setGame] = useState<FirebaseGame>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameNotFound, setGameNotFound] = useState<boolean>(false);
  const firebase = useContext(FirebaseContext);
  const listenToGame = (gameId: string): (() => null) => {
    try {
      setLoading(true);
      return firebase.firestore
        .collection("games")
        .doc(gameId)
        .onSnapshot((doc: any) => {
          if (doc.exists) {
            setGame({ id: doc.id, ...doc.data() });
          } else {
            setGameNotFound(true);
          }
          setLoading(false);
        });
    } catch (e) {
      console.log("Error", e);
    }
  };

  let view;
  // if (isSmallScreen) {
  //   view = <SmallScreenView />;
  if (loading) {
    view = <div>Loading</div>;
  } else if (game && game.stage === "WAITING_FOR_PLAYERS") {
    view = <WaitingForPlayersView />;
  } else if (game && game.stage === "CHOSING_WORDS") {
    view = <AddWordsView />;
  } else if (game && game.stage === "REVIEWING_TEAMS") {
    view = <ViewTeamsView />;
  }
  // else if (gameStage === "ENDED") {
  //   view = <GameEnded />;
  else if (game && game.stage === "PLAYING") {
    view = <Game />;
  }

  useEffect(() => {
    if (gameId) {
      const unsubscribeFromGame = listenToGame(gameId);
      return unsubscribeFromGame;
    }
  }, [gameId]);

  if (gameNotFound) {
    return <Redirect to="/" />;
  }

  return <GameContext.Provider value={game}>{view}</GameContext.Provider>;
};

export default GamePage;
