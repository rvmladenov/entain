import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import {
  Board,
  BoardResponse,
  Difficulty,
  SolveResponse,
  ValidateResponse,
} from '@shared/types/board';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBoard', () => {
    it('should fetch a board with the given difficulty', () => {
      const difficulty: Difficulty = 'easy';
      const mockResponse: BoardResponse = { board: [[0]] };

      service.getBoard(difficulty).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.API_URL}/board?difficulty=${difficulty}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('solveBoard', () => {
    it('should post the board to solve endpoint', () => {
      const board: Board = [[0]];
      const mockResponse: SolveResponse = {
        difficulty: 'easy',
        solution: [[1]],
        status: 'solved',
      };

      service.solveBoard(board).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.API_URL}/solve`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ board });
      req.flush(mockResponse);
    });
  });

  describe('validateBoard', () => {
    it('should post the board to validate endpoint', () => {
      const board: Board = [[0]];
      const mockResponse: ValidateResponse = { status: 'solved' };

      service.validateBoard(board).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.API_URL}/validate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ board });
      req.flush(mockResponse);
    });
  });
});
