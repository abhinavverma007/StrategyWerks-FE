import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Doctor} from '../models/doctor.model';
import {Count} from '../models/count.model';
import {environment} from 'src/environments/environment';

@Injectable()
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) {}

  getDoctors(limit: number = 10, offset: number = 0): Observable<Doctor[]> {
    const filter = {
      limit,
      offset,
    };

    const queryStr = JSON.stringify(filter);

    const params = new HttpParams().set('filter', queryStr);

    return this.http.get<Doctor[]>(this.apiUrl, {params});
  }

  getDoctorCount() {
    return this.http.get<Count>(`${this.apiUrl}/count`);
  }
}
