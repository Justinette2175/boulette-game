type DataAction = "update" | "set" | "delete";

export type Username = string;
export type TeamId = string;
export type MessageId = string;
export type GameId = string;
export type UserId = string;
export type WordId = string;
export type JitsyId = string;

export interface Word {
  id?: WordId;
  text: string;
  writtenBy: Username;
}

export interface User {
  id?: UserId;
  name?: Username;
  teamId?: TeamId;
  createdAt?: number;
  jitsyId?: JitsyId;
}

export interface Message {
  id: MessageId;
  text: string;
  sender: Username;
  timestamp: number;
}

export interface RoundScore {
  [key: string]: number;
}

export interface Round {
  id?: string;
  index: number;
  score?: RoundScore;
  wordsGuessed: Array<WordId>;
  wordsLeft: Array<WordId>;
}

export interface BatchUpdate {
  collection: string;
  reference: string;
  data?: any;
  action: DataAction;
}

export interface MessageReducer {
  all: Array<Message>;
  loading: boolean;
}

export interface ComputerReducer {
  users: Array<UserId>;
  timer?: Time;
  instructionsVisible: boolean;
  jitsyId: JitsyId;
  language: "EN" | "FR";
  audioMuted: boolean;
  videoMuted: boolean;
  permissionsModal: boolean;
}

export interface Team {
  id: TeamId;
  name?: string;
  lastPlayerId?: UserId;
}

export interface Time {
  minutes: number;
  seconds: number;
}

export type GameStages =
  | "WAITING_FOR_PLAYERS"
  | "CHOSING_WORDS"
  | "REVIEWING_TEAMS"
  | "PLAYING"
  | "ENDED";

export interface Game {
  id?: GameId;
  stage?: GameStages;
  rounds?: Array<Round>;
  users?: Array<User>;
  teams?: Array<Team>;
  currentRound?: string;
  currentTeam?: TeamId;
  currentUser?: Username;
  words?: Array<Word>;
  owner?: Username;
  currentWord?: Word;
  endOfCurrentTurn?: string;
  remainingTimeForNextRound?: Time;
  winner?: TeamId;
  wordsPerPlayer?: number;
  secondsPerTurn?: number;
}

export interface Store {
  messages: MessageReducer;
  game: Game;
  computer: ComputerReducer;
}
