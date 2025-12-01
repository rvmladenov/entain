import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { BoardState } from './store';
import { Store } from '@ngrx/store';
import { BoardActions } from './store/actions';
import { Difficulty } from './shared/types/board';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewGameDialogComponent } from '@shared/components/dialogs/new-game/new-game-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MatButtonModule, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly dialog = inject(MatDialog);
  readonly store = inject(Store<BoardState>);

  onNewGame(): void {
    const dialogRef = this.dialog.open(NewGameDialogComponent);

    dialogRef.afterClosed().subscribe((difficulty: Difficulty) => {
      console.log(`Dialog result: ${difficulty}`);
      this.store.dispatch(BoardActions.loadBoard({ difficulty }));
    });
  }
}
