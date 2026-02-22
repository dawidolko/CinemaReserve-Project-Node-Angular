import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Hall {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
  Seats?: any[];
}

@Injectable({ providedIn: 'root' })
export class HallService {
  private apiUrl = '/api/halls';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Hall[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<Hall>(`${this.apiUrl}/${id}`);
  }

  create(hall: { name: string; rows: number; seatsPerRow: number; vipRows?: number[] }) {
    return this.http.post<Hall>(this.apiUrl, hall);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
