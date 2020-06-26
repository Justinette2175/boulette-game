import React, { useContext } from "react";
import ScoreBoardInterface from "./ScoreBoardInterface";
import { useGameTeams } from "../hooks";
import GameContext from "../contexts/GameContext";
import CurrentRoundContext from "../contexts/CurrentRoundContext";

const ScoreBoard: React.FC = () => {
  const game = useContext(GameContext);
  const round = useContext(CurrentRoundContext);
  const currentTeam = game.currentTeam;
  const teams = useGameTeams();
  const roundScore = round ? round.score : null;
  const cumulativeSore = game.score;

  return (
    <ScoreBoardInterface
      currentTeamId={currentTeam?.id}
      currentRoundIndex={round.id}
      orderedTeams={teams.sort((t) => (t.id === "1" ? -1 : 1))}
      roundScore={roundScore}
      cumulativeScore={cumulativeSore}
    />
  );
};

export default ScoreBoard;
