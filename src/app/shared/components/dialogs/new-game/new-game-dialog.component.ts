import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Difficulty } from '@shared/types/board';

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: 'new-game-dialog.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGameDialogComponent {
  readonly form = new FormGroup({
    difficulty: new FormControl<Difficulty>('easy', [Validators.required]),
  });

  readonly difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'random'];
}
