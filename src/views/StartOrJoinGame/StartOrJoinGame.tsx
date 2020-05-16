import React from "react";
import JoinGame from "./JoinGame";
import StartGame from "./StartGame";
import ContentWrapper from "../../components/ContentWrapper";

interface IProps {
  gameId?: string;
}
const StartOrJoinGame: React.FC<IProps> = ({ gameId }) => {
  return (
    <ContentWrapper
      leftChild={<JoinGame gameId={gameId} />}
      rightChild={!gameId ? <StartGame /> : null}
      maxWidth={500}
    />
  );
};

export default StartOrJoinGame;
