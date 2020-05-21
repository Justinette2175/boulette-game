import { useSelector } from "react-redux";
import { Store, RoundScore } from "../types";
import { calculateCumulativeScore } from ".";

export default (): RoundScore => {
  const cumulativeSore: RoundScore = useSelector((state: Store) => {
    return calculateCumulativeScore(state.game.rounds);
  });
  return cumulativeSore;
};
