import React from "react";
import { useSelector } from "react-redux";
import { Store, User, Time } from "../../types";

import TimerInterface from "./TimerInterface";

const Timer: React.FC = () => {
  const timeLeft: Time = useSelector(
    (state: Store) => state.computer.timer || null
  );

  return <TimerInterface timeLeft={timeLeft} />;
};

export default Timer;
