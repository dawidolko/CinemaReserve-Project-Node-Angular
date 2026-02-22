import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  duration: number;
  genre: string;
  director: string;
  releaseDate: string;
  trailerUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = '/api/movies';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(movie: Partial<Movie>) {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  update(id: number, movie: Partial<Movie>) {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
