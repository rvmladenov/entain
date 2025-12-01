import { FormArray, FormControl } from '@angular/forms';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'random';

export type Board = Array<Array<number | null>>;

export type BoardResponse = {
  board: Board;
};

export type BoardRequest = {
  board: Board;
};

export type SolveResponse = {
  difficulty: Difficulty;
  solution: Board;
  status: 'solved' | 'broken' | 'unsolvable';
};

export type ValidateResponse = {
  // Had to adapt this type because of the difference in the response from the API and the type in the given spec
  status: 'unsolved' | 'solved' | 'broken';
};

export interface BoardFormGroup {
  row: FormArray<FormArray<FormControl<number | null>>>;
  col: FormArray<FormArray<FormControl<number | null>>>;
}
