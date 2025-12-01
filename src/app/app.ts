import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { BoardState } from './store';
import { Store } from '@ngrx/store';
import { Difficulty } from './shared/types/board';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SocketService } from '@shared/services/socket.service';
import { Message } from '@shared/types/multiplayer';
import { BoardActions } from '@store/actions';
import { MultiplayerDialogComponent } from '@shared/components/dialogs/multiplayer/multiplayer-dialog.component';
import { NewGameDialogComponent } from '@shared/components/dialogs/new-game/new-game-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MatButtonModule, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly socketService = inject(SocketService);
  readonly dialog = inject(MatDialog);
  readonly store = inject(Store<BoardState>);

  onMultiplayer(): void {
    const dialogRef = this.dialog.open(MultiplayerDialogComponent, {
      width: '400px',
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { difficulty: Difficulty; gameId: string; username: string }) => {
        console.log(`Dialog result: ${result}`);
        this.socketService?.sendMessage({
          difficulty: result.difficulty,
          gameId: result.gameId,
          username: result.username,
          message: 'Game started',
        });

        this.socketService?.onMessage(this.onSocketMessage);
      });
  }

  onNewGame(): void {
    const dialogRef = this.dialog.open(NewGameDialogComponent);

    dialogRef.afterClosed().subscribe((difficulty: Difficulty) => {
      console.log(`Dialog result: ${difficulty}`);
      this.store.dispatch(BoardActions.loadBoard({ difficulty }));
    });
  }

  private onSocketMessage(message: Message): void {
    console.log('Received message:', message);
  }
}
