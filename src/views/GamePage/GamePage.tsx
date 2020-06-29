import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../../firebase";

import { FirebaseGame } from "../../types/firebaseTypes";
import DeviceIdContext from "../../contexts/DeviceIdContext";

import AddWordsView from "../../views/AddWordsView";
import Game from "../../views/Game";
import Background from "../../components/Background";
import GameEnded from "../../views/GameEnded";
import WaitingForPlayersView from "../../views/WaitingForPlayersView";
import ViewTeamsView from "../../views/ViewTeamsView";

import GameContext from "../../contexts/GameContext";
import { Redirect } from "react-router-dom";
import JoinGame from "../StartOrJoinGame/JoinGame";

interface GamePageProps {
  match: { params: { gameId: string } };
}

const GamePage: React.FC<GamePageProps> = ({
  match: {
    params: { gameId },
  },
}) => {
  const [game, setGame] = useState<FirebaseGame>(null);
  const deviceId = useContext(DeviceIdContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameNotFound, setGameNotFound] = useState<boolean>(false);
  const [playerIsInGame, setPlayerIsInGame] = useState<boolean>(false);
  const firebase = useContext(FirebaseContext);
  const listenToGame = (gameId: string): (() => null) => {
    try {
      setLoading(true);
      return firebase
        .firestore()
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
      setGameNotFound(true);
    }
  };

  const listenToDeviceInGame = () => {
    try {
      setLoading(true);
      return firebase
        .firestore()
        .collection("games")
        .doc(gameId)
        .collection("players")
        .where("deviceId", "==", deviceId)
        .onSnapshot((doc: any) => {
          const { size } = doc;
          setLoading(false);
          if (size > 0) {
            setPlayerIsInGame(true);
          }
        });
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (game && game.id) {
      const unsubscribeFromDeviceInGame = listenToDeviceInGame();
      return unsubscribeFromDeviceInGame;
    }
  }, [game && game.id]);

  useEffect(() => {
    if (gameId) {
      const unsubscribeFromGame = listenToGame(gameId);
      return unsubscribeFromGame;
    }
  }, [gameId]);

  let view;
  // if (isSmallScreen) {
  //   view = <SmallScreenView />;
  if (loading) {
    view = <div>Loading</div>;
  } else if (!playerIsInGame) {
    view = <JoinGame />;
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

  if (gameNotFound) {
    return <Redirect to="/" />;
  }

  return <GameContext.Provider value={game}>{view}</GameContext.Provider>;
};

export default GamePage;
