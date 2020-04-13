type DataAction = "update" | "set" | "delete";

export type Username = string;
export type TeamId = string;
export type MessageId = string;
export type GameId = string;
export type UserId = string;
export type WordId = string;

export interface Word {
  id?: WordId;
  text: string;
  writtenBy: Username;
}

export interface User {
  id?: UserId;
  name: Username;
  teamId?: TeamId;
  createdAt: number;
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
  users: Array<Username>;
  timer?: number;
}

export interface Team {
  id: TeamId;
  name?: string;
  lastPlayerId?: UserId;
}

export interface Game {
  id?: GameId;
  rounds?: Array<Round>;
  users?: Array<User>;
  teams?: Array<Team>;
  countdown?: number;
  currentRound?: string;
  currentTeam?: TeamId;
  currentUser?: Username;
  words?: Array<Word>;
  owner?: Username;
  currentWord?: Word;
  endOfCurrentTurn?: string;
}

export interface Store {
  messages: MessageReducer;
  game: Game;
  computer: ComputerReducer;
}
