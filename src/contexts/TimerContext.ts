import React from "react";

const TimerContext = React.createContext<[number, () => void]>([null, null]);

export default TimerContext;
