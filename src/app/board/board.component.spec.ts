import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { BoardService } from '@shared/services/board.service';
import { ApiService } from '@shared/services/api.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BoardActions } from '@store/actions';
import { of } from 'rxjs';
import { Board, SolveResponse, ValidateResponse } from '@shared/types/board';
import {
  selectBoard,
  selectDifficulty,
  selectStatus,
  selectSolvedBoard,
  selectInitialBoard,
  selectLoading,
} from '@store/index';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let store: MockStore;
  let boardServiceSpy: jasmine.SpyObj<BoardService>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const initialState = {
    board: [],
    difficulty: 'easy',
    status: null,
    solvedBoard: null,
    initialBoard: null,
    loading: false,
  };

  beforeEach(async () => {
    const boardSpy = jasmine.createSpyObj('BoardService', ['getBoardForm']);
    const apiSpy = jasmine.createSpyObj('ApiService', ['solveBoard', 'validateBoard']);

    await TestBed.configureTestingModule({
      imports: [BoardComponent, ReactiveFormsModule, MatIconModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: BoardService, useValue: boardSpy },
        { provide: ApiService, useValue: apiSpy },
      ],
    })
      .overrideComponent(BoardComponent, {
        set: {
          providers: [
            { provide: BoardService, useValue: boardSpy },
            { provide: ApiService, useValue: apiSpy },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    boardServiceSpy = TestBed.inject(BoardService) as jasmine.SpyObj<BoardService>;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    store.overrideSelector(selectBoard, []);
    store.overrideSelector(selectDifficulty, 'easy');
    store.overrideSelector(selectStatus, null);
    store.overrideSelector(selectSolvedBoard, null);
    store.overrideSelector(selectInitialBoard, []);
    store.overrideSelector(selectLoading, false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch loadBoard action', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(dispatchSpy).toHaveBeenCalledWith(BoardActions.loadBoard({ difficulty: 'easy' }));
    });

    it('should initialize form when board is selected', () => {
      const mockBoard: Board = [
        [1, 2],
        [3, 4],
      ];
      store.overrideSelector(selectBoard, mockBoard);

      const mockFormGroup = {
        patchValue: jasmine.createSpy('patchValue'),
        value: { row: [], col: [] },
      } as any;
      boardServiceSpy.getBoardForm.and.returnValue(mockFormGroup);

      fixture.detectChanges();

      expect(boardServiceSpy.getBoardForm).toHaveBeenCalledWith(2, 2);
      expect(mockFormGroup.patchValue).toHaveBeenCalled();
    });
  });

  describe('solveBoard', () => {
    it('should dispatch isLoading and solveBoardSuccess actions', () => {
      const mockBoard: Board = [[0]];
      const mockSolution: Board = [[1]];
      const mockResponse: SolveResponse = {
        solution: mockSolution,
        status: 'solved',
        difficulty: 'easy',
      };

      component.boardForm = {
        value: mockBoard,
        patchValue: jasmine.createSpy('patchValue'),
      } as any;

      apiServiceSpy.solveBoard.and.returnValue(of(mockResponse));
      const dispatchSpy = spyOn(store, 'dispatch');

      component.solveBoard();

      expect(dispatchSpy).toHaveBeenCalledWith(BoardActions.isLoading({ isLoading: true }));
      expect(apiServiceSpy.solveBoard).toHaveBeenCalledWith(mockBoard);
      expect(component.boardForm.patchValue).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        BoardActions.solveBoardSuccess({ response: mockResponse })
      );
    });
  });

  describe('validateBoard', () => {
    it('should dispatch isLoading and validateBoardSuccess actions', () => {
      const mockBoard: Board = [[1]];
      const mockResponse: ValidateResponse = { status: 'solved' };

      component.boardForm = {
        value: mockBoard,
      } as any;

      apiServiceSpy.validateBoard.and.returnValue(of(mockResponse));
      const dispatchSpy = spyOn(store, 'dispatch');

      component.validateBoard();

      expect(dispatchSpy).toHaveBeenCalledWith(BoardActions.isLoading({ isLoading: true }));
      expect(apiServiceSpy.validateBoard).toHaveBeenCalledWith(mockBoard);
      expect(dispatchSpy).toHaveBeenCalledWith(
        BoardActions.validateBoardSuccess({ response: mockResponse })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(BoardActions.isLoading({ isLoading: false }));
    });
  });
});
