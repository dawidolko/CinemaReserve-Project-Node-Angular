import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getAllReservations() {
    return this.http.get<any[]>(`${this.apiUrl}/reservations`);
  }

  getUsers() {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: number, role: string) {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role });
  }
}
