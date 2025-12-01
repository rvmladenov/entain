import { TestBed } from '@angular/core/testing';
import { BoardService } from './board.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService],
      imports: [ReactiveFormsModule],
    });
    service = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBoardForm', () => {
    it('should create a form group with correct dimensions', () => {
      const rows = 9;
      const cols = 9;
      const form = service.getBoardForm(rows, cols);

      expect(form.controls.row.length).toBe(rows);
      expect(form.controls.row.at(0).length).toBe(cols);
      expect(form.controls.col.length).toBe(rows);
      expect(form.controls.col.at(0).length).toBe(cols);
    });

    it('should initialize controls with null value and enabled by default', () => {
      const form = service.getBoardForm(1, 1);
      const control = form.controls.row.at(0).at(0);

      expect(control.value).toBeNull();
      expect(control.disabled).toBeFalse();
    });

    it('should initialize controls with value and disabled when initialValue is provided', () => {
      const initialValue = 5;
      const form = service.getBoardForm(1, 1, initialValue);
      const control = form.controls.row.at(0).at(0);

      expect(control.value).toBe(initialValue);
      expect(control.disabled).toBeTrue();
    });

    it('should have pattern validator', () => {
      const form = service.getBoardForm(1, 1);
      const control = form.controls.row.at(0).at(0);

      control.setValue(5);
      expect(control.valid).toBeTrue();

      control.setValue(0);
      expect(control.valid).toBeFalse();

      control.setValue(10);
      expect(control.valid).toBeFalse();

      control.setValue('a' as unknown as number);
      expect(control.valid).toBeFalse();
    });
  });
});
