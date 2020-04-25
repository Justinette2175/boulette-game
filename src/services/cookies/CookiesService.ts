import Cookies from "js-cookie";
import { GameId, UserId } from "../../types";

class CookiesService {
  setGameId = (id: GameId) => {
    Cookies.set("gameId", id, { expires: 1 });
  };

  getUsers = (): Array<string> => {
    return Cookies.getJSON("users") || [];
  };

  addUserToUsers = (userId: UserId) => {
    const users = this.getUsers();
    if (users.indexOf(userId) < 0) {
      users.push(userId);
    }
    Cookies.set("users", users, { expires: 1 });
  };

  clearCookies = () => {
    Cookies.remove("gameId");
    Cookies.remove("users");
  };
}

export default new CookiesService();
