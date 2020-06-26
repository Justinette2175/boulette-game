import React, { useContext } from "react";
import SliderInterface from "./SliderInterface";
import GameContext from "../../contexts/GameContext";

const Slider: React.FC = () => {
  const game = useContext(GameContext);
  const currentTeamId = game?.currentTeam?.id;
  return <SliderInterface currentTeamId={currentTeamId} />;
};

export default Slider;
