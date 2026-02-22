import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private apiUrl = '/api/content';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Record<string, string>>(this.apiUrl);
  }

  update(key: string, content: string) {
    return this.http.put(`${this.apiUrl}/${key}`, { content });
  }

  getSections() {
    return this.http.get<any[]>(`${this.apiUrl}/sections`);
  }

  updateSections(sections: any[]) {
    return this.http.put(`${this.apiUrl}/sections`, sections);
  }
}
