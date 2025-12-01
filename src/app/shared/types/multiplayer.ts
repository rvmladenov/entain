import { Difficulty } from './board';

export interface Message {
  difficulty: Difficulty;
  gameId: string;
  username: string;
  message: string;
}
