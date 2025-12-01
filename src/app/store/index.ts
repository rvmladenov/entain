import { createFeature, createReducer, on } from '@ngrx/store';
import { Board, Difficulty } from '../shared/types/board';
import { BoardActions } from './actions';

export interface BoardState {
  board: Board;
  solvedBoard: Board | null; // Used to store the solved board in order to detect when one enters a number but that number is incorrect
  initialBoard: Board; // TODO: Tova moje i da ne mi trqbva
  difficulty: Difficulty;
  time: number;
  loading: boolean;
  solving: boolean;
  validating: boolean;
  error: string | null; // In case the API returns an error we will need a fallback. Probably using some cached data
  status: 'unsolved' | 'solved' | 'broken' | 'unsolvable' | null;
}

const initialState: BoardState = {
  board: [],
  solvedBoard: null,
  initialBoard: [],
  difficulty: 'easy',
  time: 0,
  loading: false,
  solving: false,
  validating: false,
  error: null,
  status: null,
};

export const boardFeature = createFeature({
  name: 'board',
  reducer: createReducer(
    initialState,
    // Load Board
    on(BoardActions.loadBoard, (state, { difficulty }) => ({
      ...state,
      time: 0,
      loading: true,
      error: null,
      difficulty,
      status: null,
    })),
    on(BoardActions.loadBoardSuccess, (state, { board }) => ({
      ...state,
      loading: false,
      time: state.time + 1,
      board,
      initialBoard: JSON.parse(JSON.stringify(board)), // best way to deep copy else we need to use a library like lodash
      solvedBoard: null,
    })),
    on(BoardActions.loadBoardFailure, (state, { error }) => ({
      ...state,
      loading: false,
      time: 0,
      error,
    })),

    // TODO: Update Cell - need to extend this to show if the cell is correct or not but the API does not support it
    on(BoardActions.updateCell, (state, { row, col, value }) => {
      const newBoard = state.board.map((r) => [...r]);
      newBoard[row][col] = value;
      return {
        ...state,
        board: newBoard,
      };
    }),

    // Solve Board
    on(BoardActions.solveBoard, (state) => ({
      ...state,
      solving: true,
      error: null,
    })),
    on(BoardActions.solveBoardSuccess, (state, { response }) => ({
      ...state,
      solving: false,
      board: response.solution,
      status: response.status,
    })),
    on(BoardActions.solveBoardFailure, (state, { error }) => ({
      ...state,
      solving: false,
      error,
    })),

    // Solve Board cache
    on(BoardActions.solveBoardCache, (state, { board }) => ({
      ...state,
      solvedBoard: board,
    })),
    on(BoardActions.solveBoardCacheSuccess, (state, { response }) => ({
      ...state,
      solvedBoard: response.solution,
    })),
    on(BoardActions.solveBoardCacheFailure, (state, { error }) => ({
      ...state,
      solvedBoard: null,
      error,
    })),

    // Validate Board
    on(BoardActions.validateBoard, (state) => ({
      ...state,
      validating: true,
      error: null,
    })),
    on(BoardActions.validateBoardSuccess, (state, { response }) => ({
      ...state,
      validating: false,
      status: response.status,
    })),
    on(BoardActions.validateBoardFailure, (state, { error }) => ({
      ...state,
      validating: false,
      error,
    })),
    on(BoardActions.isLoading, (state, { isLoading }) => ({
      ...state,
      loading: isLoading,
    }))
  ),
});

export const {
  name: boardFeatureKey,
  reducer: boardReducer,
  selectBoardState,
  selectBoard,
  selectInitialBoard,
  selectDifficulty,
  selectLoading,
  selectSolving,
  selectStatus,
  selectSolvedBoard,
} = boardFeature;
