import { Difficulty } from './board';

export interface Message {
  type: MultiplayerGameType;
  difficulty: Difficulty;
  gameId: string;
  username: string;
  message: string;
}

export type MultiplayerGameType = 'new' | 'join';
