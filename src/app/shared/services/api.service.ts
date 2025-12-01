import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Board,
  BoardResponse,
  Difficulty,
  SolveResponse,
  ValidateResponse,
} from '@shared/types/board';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getBoard(difficulty: Difficulty): Observable<BoardResponse> {
    return this.http.get<BoardResponse>(`${this.apiUrl}/board?difficulty=${difficulty}`);
  }

  solveBoard(board: Board): Observable<SolveResponse> {
    return this.http.post<SolveResponse>(`${this.apiUrl}/solve`, { board });
  }

  validateBoard(board: Board): Observable<ValidateResponse> {
    return this.http.post<ValidateResponse>(`${this.apiUrl}/validate`, { board });
  }
}
