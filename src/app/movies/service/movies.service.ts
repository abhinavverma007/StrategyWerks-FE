import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Count} from '../models/count.model';
import {environment} from 'src/environments/environment';

@Injectable()
export class MoviesService {
  private apiUrl = `${environment.apiUrl}/api/movies`;

  constructor(private http: HttpClient) {}

  getMovies(limit: number = 10, offset: number = 0): Observable<any> {

    return this.http.get(`${this.apiUrl}?limit=${limit}&offset=${offset}`);
  }

  getMoviesCount() {
    return this.http.get<Count>(`${this.apiUrl}/count`);
  }
}
