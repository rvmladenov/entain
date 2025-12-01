import { Component, inject, OnInit } from '@angular/core';
import { Board, BoardFormGroup } from '@shared/types/board';
import { BoardService } from '@shared/services/board.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { ApiService } from '@shared/services/api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BoardActions } from '@store/actions';
import {
  BoardState,
  selectBoard,
  selectLoading,
  selectDifficulty,
  selectStatus,
  selectSolvedBoard,
  selectInitialBoard,
} from '@store/index';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  providers: [BoardService, ApiService],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  readonly store = inject(Store<BoardState>);
  private readonly boardService = inject(BoardService);
  private readonly apiService = inject(ApiService);

  boardForm!: FormGroup<BoardFormGroup>;

  difficulty = this.store.selectSignal(selectDifficulty);
  status = this.store.selectSignal(selectStatus);

  // Used to detect if the entered number is correct or not
  // I am leaving this just as a demo in case of real case but with this API it is not working because of the API's dummy data
  solvedBoard = this.store.selectSignal(selectSolvedBoard);
  initialBoard = this.store.selectSignal(selectInitialBoard);
  isLoading = this.store.selectSignal(selectLoading);

  ngOnInit(): void {
    // Initial load. Can be changed to a default screen if needed
    this.store.dispatch(BoardActions.loadBoard({ difficulty: 'easy' }));

    this.store.select(selectBoard).subscribe((board) => {
      if (board?.length) {
        this.boardForm = this.boardService.getBoardForm(board.length, board[0].length);
        this.boardForm.patchValue({
          row: board.map((row) => row.map((cell) => cell || null)),
          col: board.map((row) => row.map((cell) => cell || null)),
        });
      }
    });
  }

  solveBoard(): void {
    this.store.dispatch(BoardActions.isLoading({ isLoading: true }));
    this.apiService.solveBoard(this.boardForm.value as Board).subscribe((solvedBoard) => {
      this.boardForm.patchValue({
        row: solvedBoard.solution.map((row) => row.map((cell) => cell || null)),
        col: solvedBoard.solution.map((row) => row.map((cell) => cell || null)),
      });

      this.store.dispatch(BoardActions.solveBoardSuccess({ response: solvedBoard }));
    });
  }

  validateBoard(): void {
    this.store.dispatch(BoardActions.isLoading({ isLoading: true }));
    this.apiService.validateBoard(this.boardForm.value as Board).subscribe((response) => {
      this.store.dispatch(BoardActions.validateBoardSuccess({ response }));
      this.store.dispatch(BoardActions.isLoading({ isLoading: false }));
    });
  }
}
