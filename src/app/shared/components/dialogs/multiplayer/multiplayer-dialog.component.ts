import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Difficulty } from '@shared/types/board';
import { MatInputModule } from '@angular/material/input';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTab } from '@angular/material/tabs';

@Component({
  selector: 'app-multiplayer-dialog',
  templateUrl: 'multiplayer-dialog.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatTabGroup,
    MatTab,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiplayerDialogComponent {
  readonly newGameform = new FormGroup({
    difficulty: new FormControl<Difficulty>('easy', [Validators.required]),
    gameId: new FormControl<string>('', [Validators.required]),
    username: new FormControl<string>('', [Validators.required]),
  });

  readonly joinGameform = new FormGroup({
    gameId: new FormControl<string>('', [Validators.required]),
    username: new FormControl<string>('', [Validators.required]),
  });

  readonly difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'random'];
}
