export type GameStage =
  | "WAITING_FOR_PLAYERS"
  | "CHOSING_WORDS"
  | "REVIEWING_TEAMS"
  | "PLAYING"
  | "ENDED";

export interface NewGame {
  owner: {
    id: string;
    name: string;
    deviceId: string;
  };
  wordsPerPlayer: number;
  secondsPerTurn: number;
  stage: "WAITING_FOR_PLAYERS";
  shortId: string;
}

export interface FirebaseGame {
  id: string;
  currentRound: {
    id: string;
    description: string;
  };
  owner: {
    id: string;
    name: string;
    deviceId: string;
  };
  wordsPerPlayer: number;
  secondsPerTurn: number;
  stage: GameStage;
  shortId: string;
  currentPlayer: {
    id: string;
    name: string;
    deviceId: string;
  };
  currentTeam: {
    id: string;
    name: string;
  };
  currentWord: FirebaseGameWord;
  score: {
    [teamId: string]: number;
  };
}

export interface NewPlayer {
  id?: string;
  name: string;
  deviceId: string;
}

export interface FirebasePlayer {
  id: string;
  name: string;
  deviceId: string;
}

export interface FirebaseGameRound {
  id: string;
  index: number;
  score: {
    [teamId: string]: number;
  };
  wordsLeft: Array<{
    word: string;
    writtenBy: {
      id: string;
      username: string;
    };
  }>;
}

export interface NewWord {
  writtenBy: {
    id: string;
    name: string;
  };
  word: string;
}

export interface FirebaseGameWord {
  id: string;
  writtenBy: {
    id: string;
    name: string;
  };
  word: string;
}

export interface FirebaseGameTeam {
  id: string;
  name: string;
  totalScore: number;
  players: {
    [key: string]: {
      id: string;
      name: string;
      deviceId: string;
    };
  };
}
