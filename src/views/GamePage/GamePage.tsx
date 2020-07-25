import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../../firebase";

import { FirebaseGame } from "../../types/firebaseTypes";
import DeviceIdContext from "../../contexts/DeviceIdContext";

import InCallViews from "./InCallViews";

import GameContext from "../../contexts/GameContext";
import { Redirect } from "react-router-dom";
import JoinGame from "../JoinGame/JoinGame";
import { LoadingView } from "../../components/Loading";

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
    if (game && game.id && deviceId) {
      const unsubscribeFromDeviceInGame = listenToDeviceInGame();
      return unsubscribeFromDeviceInGame;
    }
  }, [game?.id, deviceId]);

  useEffect(() => {
    if (gameId) {
      const unsubscribeFromGame = listenToGame(gameId);
      return unsubscribeFromGame;
    }
  }, [gameId]);

  let view;
  if (loading) {
    view = <LoadingView />;
  } else if (!playerIsInGame) {
    view = <JoinGame />;
  } else if (game) {
    view = <InCallViews />;
  }

  if (gameNotFound) {
    return <Redirect to="/games/new" />;
  }

  return <GameContext.Provider value={game}>{view}</GameContext.Provider>;
};

export default GamePage;
