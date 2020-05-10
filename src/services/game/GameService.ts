import ReduxStore from "../../redux/store";
import "firebase/firestore";
import { GameId, Username, Word, JitsyId } from "../../types";

import GameObject from "./Game";

class GameService {
  game: GameObject;

  createGame = async (ownerName: Username) => {
    const initialGameId = ReduxStore.getState().game.id;
    if (!initialGameId) {
      this.game = new GameObject();
      this.game.create({ ownerName });
    }
  };

  loadGame = async (gameId: GameId) => {
    this.game = new GameObject(gameId);
    await this.game.load();
  };

  joinGame = async (userName: Username, gameId: GameId) => {
    this.game = new GameObject(gameId);
    this.game.join({ userName });
  };

  addPlayerOnDevice(name: string) {
    if (this.game) {
      this.game.addPlayerOnDevice(name);
    }
  }

  choseWords = () => {
    if (this.game) {
      this.game.startChoseWords();
    }
  };

  startGame = () => {
    if (this.game) {
      this.game.start();
    }
  };

  startMiming = () => {
    if (this.game) {
      this.game.startMiming();
    }
  };

  handleFoundWord = (word: Word) => {
    if (this.game) {
      this.game.handleFoundWord(word);
    }
  };

  storeJitsyId = (jitsyId: JitsyId) => {
    if (this.game) {
      this.game.storeJitsyId(jitsyId);
    }
  };

  terminateGame = () => {
    if (this.game) {
      this.game.terminate();
    }
  };
}

export default new GameService();
