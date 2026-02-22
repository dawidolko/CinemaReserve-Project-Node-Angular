import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  private loadUser() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      this.currentUser.set(JSON.parse(userData));
    }
  }

  register(data: { email: string; password: string; firstName: string; lastName: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.handleAuth(res))
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => this.handleAuth(res))
    );
  }

  updateProfile(data: Partial<{ firstName: string; lastName: string; email: string; avatarUrl: string; password: string }>) {
    return this.http.put<User>(`${this.apiUrl}/profile`, data).pipe(
      tap((user) => {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }
}
