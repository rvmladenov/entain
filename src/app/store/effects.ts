import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { BoardActions } from './actions';
import { ApiService } from '@shared/services/api.service';
import { of } from 'rxjs';
import { BoardState, selectBoard } from '.';
import { Store } from '@ngrx/store';
import { Board } from '@shared/types/board';
import { EndGameDialogComponent } from '@shared/components/dialogs/end-game/end-game-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class BoardEffects {
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(ApiService);
  private readonly store = inject(Store<BoardState>);
  private readonly dialog = inject(MatDialog);

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoard),
      tap(() => this.store.dispatch(BoardActions.isLoading({ isLoading: true }))),
      switchMap(({ difficulty }) =>
        this.apiService.getBoard(difficulty).pipe(
          map((board) => BoardActions.loadBoardSuccess({ board: board.board })),
          catchError((error) => of(BoardActions.loadBoardFailure({ error })))
        )
      )
    )
  );

  // Loads the solved board from the API and caches it in the store for dirty checking the board
  loadResolveSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BoardActions.loadBoardSuccess),
        tap(() => this.store.dispatch(BoardActions.isLoading({ isLoading: true }))),
        switchMap(() =>
          this.apiService.solveBoard(this.store.selectSignal(selectBoard)() as Board).pipe(
            tap(() => this.store.dispatch(BoardActions.isLoading({ isLoading: false }))),
            map((response) => BoardActions.solveBoardCacheSuccess({ response })),
            catchError((error) => of(BoardActions.solveBoardCacheFailure({ error })))
          )
        )
      ),
    { dispatch: false }
  );

  solveBoard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BoardActions.solveBoardSuccess),
        tap(() => {
          this.store.dispatch(BoardActions.isLoading({ isLoading: false }));
          this.dialog.open(EndGameDialogComponent);
        })
      ),
    { dispatch: false }
  );
}
