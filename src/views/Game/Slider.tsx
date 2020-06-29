import React, { useContext } from "react";
import SliderInterface from "./SliderInterface";
import CurrentRoundContext from "../../contexts/CurrentRoundContext";

interface IProps {
  openInstructions: () => void;
}

const Slider: React.FC<IProps> = ({ openInstructions }) => {
  const round = useContext(CurrentRoundContext);
  const currentTeamId = round?.currentTeam?.id || null;
  return (
    <SliderInterface
      currentTeamId={currentTeamId}
      openInstructions={openInstructions}
    />
  );
};

export default Slider;
