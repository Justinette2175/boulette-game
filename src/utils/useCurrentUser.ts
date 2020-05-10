import React from "react";
import { useSelector } from "react-redux";
import { Store, User } from "../types";

export default (): User => {
  const currentUser = useSelector(
    (state: Store) =>
      state.game.currentUser &&
      state.game.users.find((u) => u.id === state.game.currentUser)
  );

  return currentUser;
};
