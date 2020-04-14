import React from "react";
import { useSelector } from "react-redux";
import { Store } from "../types";

export default (): boolean => {
  const currentPlayerIsOnDevice = useSelector(
    (state: Store) =>
      state.game.currentUser &&
      state.computer.users.indexOf(state.game.currentUser) > -1
  );

  return currentPlayerIsOnDevice;
};
