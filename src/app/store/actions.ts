import { createActionGroup, props } from '@ngrx/store';
import { Board, Difficulty, SolveResponse, ValidateResponse } from '../shared/types/board';

export const BoardActions = createActionGroup({
  source: 'Board',
  events: {
    'Load Board': props<{ difficulty: Difficulty }>(),
    'Load Board Success': props<{ board: Board }>(),
    'Load Board Failure': props<{ error: string }>(),

    'Update Cell': props<{ row: number; col: number; value: number | null }>(),

    'Solve Board Cache': props<{ board: Board }>(),
    'Solve Board Cache Success': props<{ response: SolveResponse }>(),
    'Solve Board Cache Failure': props<{ error: string }>(),

    'Solve Board': props<{ board: Board }>(),
    'Solve Board Success': props<{ response: SolveResponse }>(),
    'Solve Board Failure': props<{ error: string }>(),

    'Validate Board': props<{ board: Board }>(),
    'Validate Board Success': props<{ response: ValidateResponse }>(),
    'Validate Board Failure': props<{ error: string }>(),
    'Is Loading': props<{ isLoading: boolean }>(),
  },
});
