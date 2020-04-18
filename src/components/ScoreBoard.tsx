import React from "react";
import { useSelector } from "react-redux";
import useCurrentRoundIndex from "../utils/useCurrentRoundIndex";
import useCurrentRoundSore from "../utils/useCurrentRoundScore";
import useCumulativeScore from "../utils/useCumulativeScore";
import { Store } from "../types";
import ScoreBoardInterface from "./ScoreBoardInterface";

const ScoreBoard: React.FC = () => {
  let currentTeam = useSelector((state: Store) => state.game.currentTeam);
  const currentRoundIndex = useCurrentRoundIndex();
  const teams = useSelector((state: Store) => state.game.teams);
  const roundScore = useCurrentRoundSore();
  const cumulativeSore = useCumulativeScore();

  return (
    <ScoreBoardInterface
      currentTeamId={currentTeam}
      currentRoundIndex={currentRoundIndex}
      orderedTeams={teams.sort((t) => (t.id === "1" ? -1 : 1))}
      roundScore={roundScore}
      cumulativeScore={cumulativeSore}
    />
  );
};

export default ScoreBoard;
