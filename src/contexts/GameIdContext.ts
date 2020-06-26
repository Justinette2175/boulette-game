import React from "react";

const GameIdContext = React.createContext<[string, (gameId: string) => void]>([
  null,
  null,
]);

export default GameIdContext;
