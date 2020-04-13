import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import useCurrentRoundIndex from "../../utils/useCurrentRoundIndex";
import { Store, User, RoundScore } from "../../types";
import { PALETTE_PURPLE_DARK } from "../../theme";
import { SCORE_BOARD_WIDTH } from "../../constants";

const Timer: React.FC = () => {
  const secondsLeft: number = useSelector(
    (state: Store) => state.computer.timer
  );

  const currentTeam = useSelector((state: Store) => state.game.currentTeam);

  const currentPlayerName = useSelector((state: Store) => {
    if (state.game.currentUser) {
      const user: User = state.game.users.find(
        (u) => u.id === state.game.currentUser
      );
      return user ? user.name : null;
    }
    return null;
  });

  return (
    <Box
      textAlign={currentTeam === "1" ? "left" : "right"}
      width="100%"
      style={{ color: "white" }}
    >
      <Typography variant="h3">It is {currentPlayerName}'s turn</Typography>
      {secondsLeft && <Typography variant="h1">{secondsLeft}</Typography>}
    </Box>
  );
};

export default Timer;
