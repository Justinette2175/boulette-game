export type GameStage =
  | "WAITING_FOR_PLAYERS"
  | "CHOSING_WORDS"
  | "REVIEWING_TEAMS"
  | "PLAYING"
  | "ENDED";

export interface MutedState {
  video: boolean;
  audio: boolean;
}

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
  owner: {
    id: string;
    name: string;
    deviceId: string;
  };
  wordsPerPlayer: number;
  secondsPerTurn: number;
  stage: GameStage;
  shortId: string;
  currentRound: string;
  score: {
    [teamId: string]: number;
  };
}

export interface FirebaseGameDevice {
  id?: string;
  jitsiId: string;
}

export interface NewPlayer {
  id?: string;
  name: string;
  deviceId: string;
  createdAt?: number;
}

export interface FirebasePlayer {
  id: string;
  name: string;
  deviceId: string;
  createdAt: number;
}

export interface RoundWord extends FirebaseGameWord {
  foundBy?: string;
}

export interface FirebaseGameRound {
  remainingTimeFromPreviousRound: number;
  id: string;
  index: number;
  secondsPerTurn: number;
  endOfCurrentTurn: number;
  score: {
    [teamId: string]: number;
  };
  wordsLeft: {
    [key: string]: RoundWord;
  };
  currentPlayer: FirebasePlayer;
  currentTeam: FirebaseGameTeam;
  currentWord: FirebaseGameWord;
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
  players: {
    [key: string]: FirebasePlayer;
  };
  captain: FirebasePlayer;
  lastPlayerToHavePlayed: FirebasePlayer;
}

export interface JitsiTracks {
  [key: string]: {
    exists: boolean;
    muted?: {
      audio?: boolean;
      video?: boolean;
    };
    sid?: string;
  };
}
