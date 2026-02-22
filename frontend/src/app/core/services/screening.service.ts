import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Screening {
  id: number;
  movieId: number;
  hallId: number;
  startTime: string;
  price: number;
  Movie?: any;
  Hall?: any;
  takenSeatIds?: number[];
}

@Injectable({ providedIn: 'root' })
export class ScreeningService {
  private apiUrl = '/api/screenings';

  constructor(private http: HttpClient) {}

  getAll(params?: { movieId?: number; date?: string }) {
    const queryParams: any = {};
    if (params?.movieId) queryParams.movieId = params.movieId;
    if (params?.date) queryParams.date = params.date;
    return this.http.get<Screening[]>(this.apiUrl, { params: queryParams });
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(screening: Partial<Screening>) {
    return this.http.post<Screening>(this.apiUrl, screening);
  }

  update(id: number, screening: Partial<Screening>) {
    return this.http.put<Screening>(`${this.apiUrl}/${id}`, screening);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
