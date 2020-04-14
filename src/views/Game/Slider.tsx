import React from "react";
import { useSelector } from "react-redux";
import { Store } from "../../types";
import SliderInterface from "./SliderInterface";

const Slider: React.FC = () => {
  const currentTeam = useSelector((state: Store) => state.game.currentTeam);
  return <SliderInterface currentTeamId={currentTeam} />;
};

export default Slider;
