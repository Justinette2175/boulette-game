import React from "react";
import { useSelector } from "react-redux";
import { Store, User, Time } from "../../types";

import TimerInterface from "./TimerInterface";

const Timer: React.FC = () => {
  const timeLeft: Time = useSelector(
    (state: Store) => state.computer.timer || null
  );

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
    <TimerInterface timeLeft={timeLeft} currentPlayerName={currentPlayerName} />
  );
};

export default Timer;
