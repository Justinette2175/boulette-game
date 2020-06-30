import React, { useContext } from "react";
import { Time } from "../../types";
import moment from "moment";

import TimerInterface from "./TimerInterface";
import TimerContext from "../../contexts/TimerContext";

const Timer: React.FC = () => {
  const [timeLeft] = useContext(TimerContext);

  const convertToTime = (timer: number): Time => {
    const duration = moment.duration(timer, "seconds");
    return {
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  return <TimerInterface timeLeft={convertToTime(timeLeft)} />;
};

export default Timer;
