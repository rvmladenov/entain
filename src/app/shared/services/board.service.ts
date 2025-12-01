import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardFormGroup } from '@shared/types/board';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly fb = inject(FormBuilder);

  getBoardForm(
    rows: number,
    cols: number,
    initialValue: number | null = null
  ): FormGroup<BoardFormGroup> {
    return this.fb.group<BoardFormGroup>({
      row: this.fb.array(
        Array.from({ length: rows }, () =>
          this.fb.array(
            Array.from({ length: cols }, () =>
              this.fb.control({ value: initialValue, disabled: initialValue !== null }, [
                Validators.pattern(/^[1-9]$/),
              ])
            )
          )
        )
      ),
      col: this.fb.array(
        Array.from({ length: rows }, () =>
          this.fb.array(
            Array.from({ length: cols }, () =>
              this.fb.control({ value: initialValue, disabled: initialValue !== null }, [
                Validators.pattern(/^[1-9]$/),
              ])
            )
          )
        )
      ),
    });
  }
}
