import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MovieService, Movie } from '../../core/services/movie.service';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  template: `
    <div>
      <!-- HERO -->
      @if (sections['hero']) {
        <section class="relative min-h-[600px] flex items-center overflow-hidden">
          <div class="absolute inset-0">
            @if (featuredMovie) {
              <img [src]="featuredMovie.posterUrl" alt="" class="w-full h-full object-cover opacity-10 blur-xl scale-125" />
            }
            <div class="absolute inset-0 hero-bg"></div>
          </div>

          <div class="relative z-10 max-w-[1280px] mx-auto px-6 py-20 w-full grid grid-cols-[1fr_auto] gap-12 items-center max-md:grid-cols-1">
            <div>
              <div class="inline-block px-3.5 py-1 bg-primary-light text-primary rounded-full text-[0.8rem] font-semibold mb-5 animate-pulse">Now in cinemas</div>
              <h1 class="text-6xl font-extrabold leading-[1.1] mb-4 tracking-tight max-lg:text-5xl max-md:text-4xl">{{ content['hero_title'] || 'Experience Cinema Like Never Before' }}</h1>
              <p class="text-text-secondary text-lg mb-8 leading-relaxed max-w-[540px]">{{ content['hero_subtitle'] || 'Book your favorite movies. Choose the perfect seats.' }}</p>
              <div class="flex gap-3 max-md:flex-col">
                <a routerLink="/" fragment="now-showing" class="btn btn-primary btn-lg">Browse Movies</a>
                <a routerLink="/register" class="btn btn-outline btn-lg">Join Now</a>
              </div>
            </div>

            @if (featuredMovie) {
              <a [routerLink]="['/movie', featuredMovie.id]" class="hidden md:block group">
                <div class="relative w-[260px] rounded-cinema-xl overflow-hidden shadow-cinema-lg border border-border-dark/50 transition-transform duration-500 group-hover:scale-[1.03]">
                  <img [src]="featuredMovie.posterUrl" [alt]="featuredMovie.title" class="w-full aspect-[2/3] object-cover" />
                  <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <span class="badge badge-primary mb-1">{{ featuredMovie.genre }}</span>
                    <h3 class="text-cinema-text font-bold text-lg leading-tight">{{ featuredMovie.title }}</h3>
                    <span class="text-text-muted text-sm">{{ featuredMovie.duration }} min &middot; {{ featuredMovie.director }}</span>
                  </div>
                </div>
              </a>
            }
          </div>
        </section>
      }

      <!-- NOW SHOWING -->
      @if (sections['now_showing']) {
        <section class="py-16" id="now-showing">
          <div class="max-w-[1280px] mx-auto px-6">
            <div class="flex items-center gap-4 mb-6">
              <h2 class="text-2xl font-bold whitespace-nowrap">Now Showing</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent"></div>
            </div>

            <!-- Genre Filters -->
            <div class="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
              @for (genre of genres; track genre) {
                <button class="px-4 py-1.5 rounded-full text-[0.85rem] font-medium border transition-all whitespace-nowrap"
                        [class]="selectedGenre === genre
                          ? 'bg-primary text-white border-primary'
                          : 'bg-transparent text-text-secondary border-border-dark hover:border-primary hover:text-primary'"
                        (click)="filterByGenre(genre)">
                  {{ genre }}
                </button>
              }
            </div>

            @if (loading) {
              <div class="flex gap-5 overflow-hidden">
                @for (i of [1,2,3,4,5]; track i) {
                  <div class="shrink-0 w-[220px] rounded-cinema-lg overflow-hidden bg-bg-surface">
                    <div class="aspect-[2/3] shimmer bg-bg-surface-light"></div>
                    <div class="h-10 m-3.5 rounded bg-bg-surface-light"></div>
                  </div>
                }
              </div>
            }

            <!-- Movie Slider -->
            <div class="relative group/slider">
              <button class="absolute -left-3 top-[40%] -translate-y-1/2 z-10 w-10 h-10 bg-bg-dark/90 border border-border-dark rounded-full flex items-center justify-center text-cinema-text opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-primary hover:border-primary"
                      (click)="scrollSlider(-1)">
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              </button>

              <div #movieSlider class="flex gap-5 overflow-x-auto scroll-smooth pb-4 scrollbar-hide">
                @for (movie of filteredNowShowing; track movie.id) {
                  <a [routerLink]="['/movie', movie.id]"
                     class="group shrink-0 w-[220px] max-md:w-[170px] no-underline rounded-cinema-lg overflow-hidden bg-bg-surface border border-border-dark transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cinema hover:border-primary">
                    <div class="relative aspect-[2/3] overflow-hidden">
                      <img [src]="movie.posterUrl" [alt]="movie.title" class="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" loading="lazy" />
                      <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span class="btn btn-primary btn-sm">Book Now</span>
                      </div>
                      <span class="badge badge-primary absolute top-2.5 left-2.5">{{ movie.genre }}</span>
                    </div>
                    <div class="p-3.5">
                      <h3 class="text-cinema-text text-[0.95rem] font-semibold mb-1.5 leading-tight">{{ movie.title }}</h3>
                      <div class="flex items-center gap-2 text-text-muted text-[0.8rem]">
                        <span>{{ movie.duration }} min</span>
                        <span class="w-[3px] h-[3px] rounded-full bg-text-muted"></span>
                        <span>{{ movie.director }}</span>
                      </div>
                    </div>
                  </a>
                }
              </div>

              <button class="absolute -right-3 top-[40%] -translate-y-1/2 z-10 w-10 h-10 bg-bg-dark/90 border border-border-dark rounded-full flex items-center justify-center text-cinema-text opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-primary hover:border-primary"
                      (click)="scrollSlider(1)">
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </div>
        </section>
      }

      <!-- COMING SOON -->
      @if (sections['coming_soon'] && comingSoon.length > 0) {
        <section class="py-16 bg-bg-surface">
          <div class="max-w-[1280px] mx-auto px-6">
            <div class="flex items-center gap-4 mb-8">
              <h2 class="text-2xl font-bold whitespace-nowrap">Coming Soon</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-border-dark to-transparent"></div>
            </div>
            <div class="flex flex-col gap-4">
              @for (movie of comingSoon; track movie.id) {
                <a [routerLink]="['/movie', movie.id]"
                   class="flex gap-5 p-4 bg-bg-surface-light border border-border-dark rounded-cinema-lg no-underline transition-all hover:border-accent hover:translate-x-1 max-md:flex-col">
                  <img [src]="movie.posterUrl" [alt]="movie.title" class="w-20 h-[120px] object-cover rounded-cinema shrink-0 max-md:w-full max-md:h-[200px]" loading="lazy" />
                  <div>
                    <h3 class="text-cinema-text text-[1.05rem] mb-1">{{ movie.title }}</h3>
                    <p class="text-text-muted text-[0.8rem] mb-2">{{ movie.genre }} &middot; {{ movie.duration }} min &middot; {{ movie.director }}</p>
                    <p class="text-text-secondary text-[0.85rem] mb-2.5 leading-relaxed">{{ movie.description | slice:0:120 }}...</p>
                    <span class="badge badge-accent">Coming Soon</span>
                  </div>
                </a>
              }
            </div>
          </div>
        </section>
      }

      <!-- PROMO -->
      @if (sections['promo']) {
        <section class="py-16">
          <div class="max-w-[1280px] mx-auto px-6">
            <div class="flex justify-between items-center p-10 border border-accent rounded-cinema-xl overflow-hidden max-md:flex-col max-md:text-center max-md:p-8"
                 style="background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-light) 100%)">
              <div>
                <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 text-accent" style="background: var(--accent-light)">Limited Offer</span>
                <h3 class="text-[1.6rem] font-bold mb-2">{{ content['promo_title'] || 'Special Offer' }}</h3>
                <p class="text-text-secondary text-base">{{ content['promo_text'] || 'Get 20% off on all VIP seats every Wednesday!' }}</p>
              </div>
              <div class="shrink-0 w-[120px] h-[120px] text-accent max-md:w-20 max-md:h-20">
                <svg viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="55" stroke="currentColor" stroke-width="1" opacity="0.3"/>
                  <circle cx="60" cy="60" r="40" stroke="currentColor" stroke-width="1" opacity="0.2"/>
                  <text x="60" y="55" text-anchor="middle" fill="currentColor" font-size="28" font-weight="700">20%</text>
                  <text x="60" y="75" text-anchor="middle" fill="currentColor" font-size="12" opacity="0.7">OFF</text>
                </svg>
              </div>
            </div>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .hero-bg {
      background: linear-gradient(-45deg, rgba(229,9,20,0.12), rgba(11,14,23,0.97), rgba(212,168,67,0.08), rgba(11,14,23,0.95));
      background-size: 400% 400%;
      animation: heroGradient 15s ease infinite;
    }
    @keyframes heroGradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `],
})
export class HomeComponent implements OnInit {
  @ViewChild('movieSlider') movieSlider!: ElementRef<HTMLDivElement>;

  movies: Movie[] = [];
  nowShowing: Movie[] = [];
  comingSoon: Movie[] = [];
  filteredNowShowing: Movie[] = [];
  featuredMovie: Movie | null = null;
  loading = true;
  content: Record<string, string> = {};
  sections: Record<string, boolean> = {};
  genres: string[] = [];
  selectedGenre = 'All';

  constructor(
    private movieService: MovieService,
    private contentService: ContentService,
  ) {}

  ngOnInit() {
    this.movieService.getAll().subscribe({
      next: (movies) => {
        this.movies = movies;
        const today = new Date().toISOString().split('T')[0];
        this.nowShowing = movies.filter(m => m.releaseDate <= today);
        this.comingSoon = movies.filter(m => m.releaseDate > today);
        this.featuredMovie = this.nowShowing[0] || movies[0];
        this.filteredNowShowing = this.nowShowing;
        this.genres = ['All', ...new Set(this.nowShowing.map(m => m.genre))];
        this.loading = false;
      },
      error: () => this.loading = false,
    });

    this.contentService.getAll().subscribe({
      next: (c) => this.content = c,
    });

    this.contentService.getSections().subscribe({
      next: (s) => {
        s.forEach(sec => {
          if (sec.isVisible) this.sections[sec.sectionKey] = true;
        });
      },
    });
  }

  filterByGenre(genre: string) {
    this.selectedGenre = genre;
    this.filteredNowShowing = genre === 'All'
      ? this.nowShowing
      : this.nowShowing.filter(m => m.genre === genre);
  }

  scrollSlider(direction: number) {
    this.movieSlider?.nativeElement.scrollBy({ left: direction * 660, behavior: 'smooth' });
  }
}
