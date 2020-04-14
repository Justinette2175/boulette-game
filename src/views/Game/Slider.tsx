import React from "react";
import { useSelector } from "react-redux";
import { Store } from "../../types";
import SliderInterface from "./SliderInterface";

const Slider: React.FC = () => {
  const currentTeam = useSelector((state: Store) => state.game.currentTeam);
  const jitsyRoomId = useSelector((state: Store) => state.game.jitsyRoomId);
  return (
    <SliderInterface currentTeamId={currentTeam} jitsyRoomId={jitsyRoomId} />
  );
};

export default Slider;
