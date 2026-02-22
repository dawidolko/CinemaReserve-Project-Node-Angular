import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Reservation {
  id: number;
  userId: number;
  screeningId: number;
  seatId: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  Screening?: any;
  Seat?: any;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = '/api/reservations';

  constructor(private http: HttpClient) {}

  create(screeningId: number, seatIds: number[]) {
    return this.http.post<Reservation[]>(this.apiUrl, { screeningId, seatIds });
  }

  getMy() {
    return this.http.get<Reservation[]>(`${this.apiUrl}/my`);
  }

  cancel(id: number) {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
