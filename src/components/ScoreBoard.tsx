import React, { useContext } from "react";
import ScoreBoardInterface from "./ScoreBoardInterface";
import { useGameTeams } from "../hooks";
import GameContext from "../contexts/GameContext";
import CurrentRoundContext from "../contexts/CurrentRoundContext";

interface IProps {
  openInstructions: () => void;
}
const ScoreBoard: React.FC<IProps> = ({ openInstructions }) => {
  const game = useContext(GameContext);
  const round = useContext(CurrentRoundContext);
  const currentTeam = round?.currentTeam;
  const teams = useGameTeams() || [];
  const roundScore = round ? round.score : null;
  const cumulativeSore = game.score;

  return (
    <ScoreBoardInterface
      openInstructions={openInstructions}
      currentTeamId={currentTeam ? currentTeam.id : null}
      currentRoundIndex={round?.id || null}
      orderedTeams={teams.sort((t) => (t.id === "1" ? -1 : 1))}
      roundScore={roundScore}
      cumulativeScore={cumulativeSore}
    />
  );
};

export default ScoreBoard;
