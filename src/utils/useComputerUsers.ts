import { useSelector } from "react-redux";
import { Store, User } from "../types";

export default (): Array<User> => {
  const computerUsers = useSelector((state: Store) => {
    if (state.computer.users && state.game.users) {
      return state.computer.users.map((u) => {
        const user = state.game.users.find((gu) => gu.id === u);
        return user || {};
      });
    }
    return [];
  });

  return computerUsers;
};
