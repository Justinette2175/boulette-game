type DataAction = "update" | "set" | "delete";

export type Username = string;
export type TeamId = string;
export type ComputerId = string;
export type MessageId = string;
export type RoundIndex = number;
export type GameId = string;

export interface Word {
  text: string;
  writtenBy: Username;
}

export interface User {
  name: Username;
  teamId?: TeamId;
}

export interface Message {
  id: MessageId;
  text: string;
  sender: Username;
  timestamp: number;
}

interface PointsPerTeam {
  teamId: TeamId;
  points: number;
}

export interface Round {
  index: RoundIndex;
  score: Array<PointsPerTeam>;
  wordsGuessed: Array<Word>;
  wordsLeft: Array<Word>;
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
  id: ComputerId;
  users: Array<Username>;
}

export interface Team {
  id: TeamId;
  name?: string;
}

export interface Game {
  id?: GameId;
  rounds?: Array<Round>;
  users?: Array<User>;
  teams?: Array<Team>;
  countdown?: number;
  currentRound?: RoundIndex;
  currentTeam?: TeamId;
  currentUser?: Username;
  words?: Array<Word>;
  owner?: Username;
}

export interface Store {
  messages: MessageReducer;
  game: Game;
  computer: ComputerReducer;
}
