import ReduxStore from "../../redux/store";
import "firebase/firestore";
import { GameId, Username, Word, JitsyId } from "../../types";

import GameObject, { createGameArgs } from "./Game";
import JitsiObject from "../jitsy";

class GameService {
  game: GameObject;

  createGame = async (args: createGameArgs) => {
    const initialGameId = ReduxStore.getState().game.id;
    if (!initialGameId) {
      this.game = new GameObject();
      await this.game.create(args);
    }
  };

  loadGame = async (gameId: GameId) => {
    this.game = new GameObject(gameId);
    await this.game.load();
  };

  joinGame = async (userName: Username, gameId: GameId) => {
    this.game = new GameObject(gameId);
    await this.game.join({ userName });
  };

  addPlayerOnDevice(name: string) {
    if (this.game) {
      this.game.addPlayerOnDevice(name);
    }
  }

  choseWords = async () => {
    if (this.game) {
      await this.game.startChoseWords();
    }
  };

  reviewTeams = async () => {
    if (this.game) {
      await this.game.startReviewTeams();
    }
  };

  startGame = async () => {
    if (this.game) {
      await this.game.start();
    }
  };

  startMiming = async () => {
    if (this.game) {
      await this.game.startMiming();
    }
  };

  handleFoundWord = async (word: Word) => {
    if (this.game) {
      await this.game.handleFoundWord(word);
    }
  };

  storeJitsyId = async (jitsyId: JitsyId) => {
    if (this.game) {
      await this.game.storeJitsyId(jitsyId);
    }
  };

  terminateGame = () => {
    if (this.game) {
      this.game.terminate();
    }
  };

  getJitsi = () => {
    return this.game ? this.game.jitsi : null;
  };

  setJitsi = (j: JitsiObject) => {
    this.game.jitsi = j;
  };
}

export default new GameService();
