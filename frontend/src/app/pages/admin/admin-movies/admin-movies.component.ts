import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MovieService, Movie } from '../../../core/services/movie.service';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div>
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-[1.6rem] font-bold mb-1">Movies</h1>
          <p class="text-text-secondary">Manage your cinema's movie catalog</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Cancel' : '+ Add Movie' }}
        </button>
      </div>

      @if (showForm) {
        <div class="card p-6 mb-5">
          <h3 class="text-base font-semibold mb-5">{{ editingMovie ? 'Edit Movie' : 'Add New Movie' }}</h3>
          <form (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-2 gap-x-4 max-md:grid-cols-1">
              <div class="form-group"><label>Title</label><input [(ngModel)]="form.title" name="title" required /></div>
              <div class="form-group"><label>Genre</label><input [(ngModel)]="form.genre" name="genre" required /></div>
              <div class="form-group col-span-2 max-md:col-span-1"><label>Description</label><textarea [(ngModel)]="form.description" name="description" rows="3" required></textarea></div>
              <div class="form-group"><label>Director</label><input [(ngModel)]="form.director" name="director" required /></div>
              <div class="form-group"><label>Duration (min)</label><input type="number" [(ngModel)]="form.duration" name="duration" required /></div>
              <div class="form-group"><label>Release Date</label><input type="date" [(ngModel)]="form.releaseDate" name="releaseDate" required /></div>
              <div class="form-group"><label>Poster URL</label><input [(ngModel)]="form.posterUrl" name="posterUrl" /></div>
            </div>
            @if (form.posterUrl) {
              <div class="my-3"><img [src]="form.posterUrl" alt="Preview" class="w-20 h-[120px] object-cover rounded-cinema border border-border-dark" /></div>
            }
            <div class="flex gap-3 mt-2">
              <button type="submit" class="btn btn-primary">{{ editingMovie ? 'Update' : 'Create' }}</button>
              @if (editingMovie) { <button type="button" class="btn btn-ghost" (click)="cancelEdit()">Cancel Edit</button> }
            </div>
          </form>
        </div>
      }

      <div class="mb-4">
        <input type="text" [(ngModel)]="searchQuery" placeholder="Search movies..." class="w-full max-w-[360px] px-4 py-2.5 bg-bg-surface border border-border-dark rounded-cinema text-cinema-text text-[0.9rem] focus:outline-none focus:border-primary" />
      </div>

      <div class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="admin-table">
            <thead>
              <tr><th>Poster</th><th>Title</th><th>Genre</th><th>Director</th><th>Duration</th><th>Release</th><th>Actions</th></tr>
            </thead>
            <tbody>
              @for (movie of filteredMovies; track movie.id) {
                <tr>
                  <td><img [src]="movie.posterUrl" class="w-10 h-[60px] object-cover rounded" /></td>
                  <td><strong>{{ movie.title }}</strong></td>
                  <td><span class="badge badge-primary">{{ movie.genre }}</span></td>
                  <td>{{ movie.director }}</td>
                  <td>{{ movie.duration }} min</td>
                  <td>{{ movie.releaseDate | date:'dd.MM.yyyy' }}</td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-ghost btn-sm" (click)="editMovie(movie)">Edit</button>
                      <button class="btn btn-sm text-error" (click)="deleteMovie(movie)">Delete</button>
                    </div>
                  </td>
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
export class AdminMoviesComponent implements OnInit {
  movies: Movie[] = [];
  editingMovie: Movie | null = null;
  form: Partial<Movie> = {};
  showForm = false;
  searchQuery = '';

  constructor(private movieService: MovieService) {}

  ngOnInit() { this.loadMovies(); }
  loadMovies() { this.movieService.getAll().subscribe({ next: (m) => this.movies = m }); }

  get filteredMovies(): Movie[] {
    if (!this.searchQuery) return this.movies;
    const q = this.searchQuery.toLowerCase();
    return this.movies.filter(m => m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q));
  }

  onSubmit() {
    if (this.editingMovie) {
      this.movieService.update(this.editingMovie.id, this.form).subscribe({ next: () => { this.cancelEdit(); this.loadMovies(); } });
    } else {
      this.movieService.create(this.form).subscribe({ next: () => { this.form = {}; this.loadMovies(); } });
    }
  }

  editMovie(movie: Movie) { this.editingMovie = movie; this.form = { ...movie }; this.showForm = true; }
  cancelEdit() { this.editingMovie = null; this.form = {}; this.showForm = false; }
  deleteMovie(movie: Movie) {
    if (!confirm(`Delete "${movie.title}"?`)) return;
    this.movieService.delete(movie.id).subscribe({ next: () => this.loadMovies() });
  }
}
