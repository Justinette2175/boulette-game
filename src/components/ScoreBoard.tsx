import React, { useContext } from "react";
import ScoreBoardInterface from "./ScoreBoardInterface";
import GameContext from "../contexts/GameContext";
import CurrentRoundContext from "../contexts/CurrentRoundContext";
import TeamsContext from "../contexts/TeamsContext";

interface IProps {}

const ScoreBoard: React.FC<IProps> = () => {
  const game = useContext(GameContext);
  const round = useContext(CurrentRoundContext);
  const currentTeam = round?.currentTeam;
  const teams = useContext(TeamsContext);
  const roundScore = round ? round.score : null;
  const cumulativeSore = game.score;

  return (
    <ScoreBoardInterface
      currentTeamId={currentTeam ? currentTeam.id : null}
      orderedTeams={teams.sort((t) => (t.id === "1" ? -1 : 1))}
      roundScore={roundScore}
      cumulativeScore={cumulativeSore}
    />
  );
};

export default ScoreBoard;
