import React from "react";
import JoinGame from "./JoinGame";
import StartGame from "./StartGame";
import ContentWrapper from "../../components/ContentWrapper";

interface IProps {}
const StartOrJoinGame: React.FC<IProps> = () => {
  return (
    <ContentWrapper
      leftChild={<JoinGame />}
      rightChild={<StartGame />}
      maxWidth={500}
    />
  );
};

export default StartOrJoinGame;
