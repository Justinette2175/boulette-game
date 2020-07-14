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
  numberOfDevices: 1;
  payment: {
    paid: false;
  };
  maxNumberOfDevices: number;
  devices: { [key: string]: boolean };
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
  numberOfDevices: number;
  payment: {
    paid: boolean;
    code: string;
  };
  maxNumberOfDevices: number;
  devices: { [key: string]: boolean };
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

export interface VideoTrack {
  exists: boolean;
  on?: {
    audio?: boolean;
    video?: boolean;
  };
  sid?: string;
}

export interface VideoTracks {
  [key: string]: VideoTrack;
}

export interface Code {
  numberOfPlays: number;
  playsUsed: number;
  paypalTransactionId: string;
  createdOn: string;
  cost: number;
  currency: string;
  email: string;
}
