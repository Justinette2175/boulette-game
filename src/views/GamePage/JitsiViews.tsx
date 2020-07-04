import React, { useContext } from "react";

import AddWords from "../AddWords";
import PlayGame from "../PlayGame";
import GameEnded from "../../views/GameEnded";
import WaitingForPlayers from "../WaitingForPlayers";
import ViewTeamsView from "../../views/ViewTeamsView";

import GameContext from "../../contexts/GameContext";
import TeamsContext from "../../contexts/TeamsContext";
import JitsiWrapper from "./JitsiWrapper";
import { useGameTeams } from "../../hooks";
interface IProps {}

const JitsiView: React.FC<IProps> = () => {
  const game = useContext(GameContext);
  const teams = useGameTeams();

  let view;
  if (game && game.stage === "WAITING_FOR_PLAYERS") {
    view = <WaitingForPlayers />;
  } else if (game && game.stage === "CHOSING_WORDS") {
    view = <AddWords />;
  } else if (game && game.stage === "REVIEWING_TEAMS") {
    view = <ViewTeamsView />;
  } else if (game && game.stage === "ENDED") {
    view = <GameEnded />;
  } else if (game && game.stage === "PLAYING") {
    view = <PlayGame />;
  }

  return (
    <JitsiWrapper>
      <TeamsContext.Provider value={teams || []}>{view}</TeamsContext.Provider>
    </JitsiWrapper>
  );
};

export default JitsiView;