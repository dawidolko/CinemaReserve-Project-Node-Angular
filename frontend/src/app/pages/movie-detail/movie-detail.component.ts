import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MovieService } from '../../core/services/movie.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    @if (movie) {
      <div class="relative pb-10">
        <!-- Backdrop -->
        <div class="absolute top-0 left-0 right-0 h-[450px] overflow-hidden">
          <img [src]="movie.posterUrl" alt="" class="w-full h-full object-cover opacity-15 blur-lg scale-110" />
          <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(11,14,23,0.6), var(--bg-dark) 90%)"></div>
        </div>

        <div class="relative z-10 max-w-[1100px] mx-auto px-6 pt-10">
          <!-- Header -->
          <div class="flex gap-9 mb-12 max-md:flex-col max-md:items-center max-md:text-center">
            <img [src]="movie.posterUrl" [alt]="movie.title" class="w-[280px] shrink-0 rounded-cinema-lg shadow-cinema-lg max-md:w-[200px]" />
            <div class="pt-5">
              <div class="flex gap-2 mb-4 max-md:justify-center">
                <span class="badge badge-primary">{{ movie.genre }}</span>
                <span class="badge badge-accent">{{ movie.duration }} min</span>
              </div>
              <h1 class="text-[2.2rem] font-extrabold mb-3 leading-tight">{{ movie.title }}</h1>
              <div class="flex gap-6 mb-5 max-md:justify-center">
                <span class="text-text-secondary text-[0.9rem]">Director: <strong class="text-cinema-text">{{ movie.director }}</strong></span>
                <span class="text-text-secondary text-[0.9rem]">Release: <strong class="text-cinema-text">{{ movie.releaseDate | date:'dd MMM yyyy' }}</strong></span>
              </div>
              <p class="text-text-secondary text-base leading-[1.8]">{{ movie.description }}</p>
            </div>
          </div>

          <!-- Screenings -->
          <div class="mt-5">
            <div class="flex items-center gap-4 mb-6">
              <h2 class="text-[1.4rem] font-bold whitespace-nowrap">Available Screenings</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent"></div>
            </div>

            <div class="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
              @for (date of uniqueDates; track date) {
                <button class="flex flex-col items-center px-[18px] py-2.5 bg-bg-surface border border-border-dark rounded-cinema cursor-pointer transition-all min-w-[70px] text-text-secondary hover:border-primary"
                        [class.!bg-primary]="selectedDate === date"
                        [class.!border-primary]="selectedDate === date"
                        [class.!text-white]="selectedDate === date"
                        (click)="selectedDate = date">
                  <span class="text-[0.7rem] font-medium uppercase">{{ date | date:'EEE' }}</span>
                  <span class="text-[1.2rem] font-bold leading-tight">{{ date | date:'dd' }}</span>
                  <span class="text-[0.7rem]">{{ date | date:'MMM' }}</span>
                </button>
              }
            </div>

            @if (filteredScreenings.length === 0) {
              <div class="text-text-muted text-center py-10">No screenings for this date.</div>
            }

            <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 max-md:grid-cols-1">
              @for (screening of filteredScreenings; track screening.id) {
                <div class="card flex items-center gap-4 px-5 py-4">
                  <div class="text-2xl font-bold text-cinema-text min-w-[60px]">{{ screening.startTime | date:'HH:mm' }}</div>
                  <div class="flex-1 flex flex-col gap-0.5">
                    <span class="text-text-secondary text-[0.85rem]">{{ screening.Hall?.name }}</span>
                    <span class="text-primary font-semibold text-[0.95rem]">{{ screening.price }} PLN</span>
                  </div>
                  @if (auth.isLoggedIn()) {
                    <a [routerLink]="['/screening', screening.id, 'seats']" class="btn btn-primary btn-sm">Choose Seats</a>
                  } @else {
                    <a routerLink="/login" class="btn btn-outline btn-sm">Login to Book</a>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="flex justify-center py-24">
        <div class="w-10 h-10 border-[3px] border-border-dark border-t-primary rounded-full animate-spin"></div>
      </div>
    }
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar { height: 0; }
  `],
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  uniqueDates: string[] = [];
  selectedDate = '';

  constructor(private route: ActivatedRoute, private movieService: MovieService, public auth: AuthService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getById(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.extractDates(movie.Screenings || []);
      },
    });
  }

  private extractDates(screenings: any[]) {
    const dates = new Set<string>();
    screenings.forEach(s => dates.add(new Date(s.startTime).toISOString().split('T')[0]));
    this.uniqueDates = Array.from(dates).sort();
    if (this.uniqueDates.length > 0) this.selectedDate = this.uniqueDates[0];
  }

  get filteredScreenings(): any[] {
    if (!this.movie?.Screenings) return [];
    return this.movie.Screenings
      .filter((s: any) => new Date(s.startTime).toISOString().split('T')[0] === this.selectedDate)
      .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }
}
