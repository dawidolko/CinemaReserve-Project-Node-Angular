import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ScreeningService, Screening } from '../../../core/services/screening.service';
import { MovieService, Movie } from '../../../core/services/movie.service';
import { HallService, Hall } from '../../../core/services/hall.service';

@Component({
  selector: 'app-admin-screenings',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div>
      <div class="flex justify-between items-start mb-6">
        <div><h1 class="text-[1.6rem] font-bold mb-1">Screenings</h1><p class="text-text-secondary">Manage movie screenings and schedules</p></div>
        <button class="btn btn-primary" (click)="showForm = !showForm">{{ showForm ? 'Cancel' : '+ Add Screening' }}</button>
      </div>

      @if (showForm) {
        <div class="card p-6 mb-5">
          <h3 class="text-base font-semibold mb-5">New Screening</h3>
          <form (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-2 gap-x-4 max-md:grid-cols-1">
              <div class="form-group">
                <label>Movie</label>
                <select [(ngModel)]="movieId" name="movieId" required>
                  <option value="">-- Select Movie --</option>
                  @for (movie of movies; track movie.id) { <option [value]="movie.id">{{ movie.title }}</option> }
                </select>
              </div>
              <div class="form-group">
                <label>Hall</label>
                <select [(ngModel)]="hallId" name="hallId" required>
                  <option value="">-- Select Hall --</option>
                  @for (hall of halls; track hall.id) { <option [value]="hall.id">{{ hall.name }}</option> }
                </select>
              </div>
              <div class="form-group"><label>Date & Time</label><input type="datetime-local" [(ngModel)]="startTime" name="startTime" required /></div>
              <div class="form-group"><label>Price (PLN)</label><input type="number" [(ngModel)]="price" name="price" step="0.01" min="1" required /></div>
            </div>
            <button type="submit" class="btn btn-primary">Create Screening</button>
          </form>
        </div>
      }

      <div class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="admin-table">
            <thead><tr><th>Movie</th><th>Hall</th><th>Date & Time</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>
              @for (s of screenings; track s.id) {
                <tr>
                  <td><strong>{{ s.Movie?.title }}</strong></td>
                  <td>{{ s.Hall?.name }}</td>
                  <td>{{ s.startTime | date:'dd.MM.yyyy HH:mm' }}</td>
                  <td>{{ s.price }} PLN</td>
                  <td><button class="btn btn-sm text-error" (click)="deleteScreening(s)">Delete</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminScreeningsComponent implements OnInit {
  screenings: Screening[] = [];
  movies: Movie[] = [];
  halls: Hall[] = [];
  movieId = ''; hallId = ''; startTime = ''; price = 25;
  showForm = false;

  constructor(private screeningService: ScreeningService, private movieService: MovieService, private hallService: HallService) {}

  ngOnInit() {
    this.loadScreenings();
    this.movieService.getAll().subscribe({ next: (m) => this.movies = m });
    this.hallService.getAll().subscribe({ next: (h) => this.halls = h });
  }

  loadScreenings() { this.screeningService.getAll().subscribe({ next: (s) => this.screenings = s }); }

  onSubmit() {
    this.screeningService.create({ movieId: +this.movieId, hallId: +this.hallId, startTime: new Date(this.startTime).toISOString(), price: this.price }).subscribe({
      next: () => { this.movieId = ''; this.hallId = ''; this.startTime = ''; this.showForm = false; this.loadScreenings(); },
    });
  }

  deleteScreening(s: Screening) {
    if (!confirm('Delete this screening?')) return;
    this.screeningService.delete(s.id).subscribe({ next: () => this.loadScreenings() });
  }
}
