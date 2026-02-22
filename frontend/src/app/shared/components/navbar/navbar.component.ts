import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-[1000] backdrop-blur-xl border-b border-border-dark h-[68px] flex items-center transition-all"
         [class.shadow-cinema]="scrolled"
         [style.background]="scrolled ? 'rgba(11,14,23,0.95)' : 'rgba(11,14,23,0.85)'">
      <div class="max-w-[1280px] mx-auto px-6 w-full flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2.5 no-underline text-cinema-text">
          <svg class="w-8 h-8 text-primary" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2"/>
            <circle cx="20" cy="20" r="6" fill="currentColor"/>
            <circle cx="20" cy="6" r="2.5" fill="currentColor"/>
            <circle cx="20" cy="34" r="2.5" fill="currentColor"/>
            <circle cx="6" cy="20" r="2.5" fill="currentColor"/>
            <circle cx="34" cy="20" r="2.5" fill="currentColor"/>
            <circle cx="10" cy="10" r="2" fill="currentColor"/>
            <circle cx="30" cy="10" r="2" fill="currentColor"/>
            <circle cx="10" cy="30" r="2" fill="currentColor"/>
            <circle cx="30" cy="30" r="2" fill="currentColor"/>
          </svg>
          <span class="text-[1.3rem] font-bold tracking-tight">Cinema<span class="text-primary">Reserve</span></span>
        </a>

        <div class="nav-links flex items-center gap-2"
             [class.nav-links-open]="menuOpen()">
          <a routerLink="/" routerLinkActive="!text-primary" [routerLinkActiveOptions]="{exact: true}"
             class="text-text-secondary no-underline text-[0.9rem] font-medium px-3.5 py-2 rounded-cinema transition-all hover:text-cinema-text hover:bg-bg-surface-light"
             (click)="closeMenu()">Movies</a>

          @if (auth.isLoggedIn()) {
            <a routerLink="/my-reservations" routerLinkActive="!text-primary"
               class="text-text-secondary no-underline text-[0.9rem] font-medium px-3.5 py-2 rounded-cinema transition-all hover:text-cinema-text hover:bg-bg-surface-light"
               (click)="closeMenu()">My Reservations</a>

            @if (auth.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="!text-primary"
                 class="text-text-secondary no-underline text-[0.9rem] font-medium px-3.5 py-2 rounded-cinema transition-all hover:text-cinema-text hover:bg-bg-surface-light"
                 (click)="closeMenu()">Admin Panel</a>
            }

            <div class="flex items-center gap-2.5 ml-2 pl-4 border-l border-border-dark max-md:ml-0 max-md:pl-0 max-md:border-l-0 max-md:pt-3 max-md:border-t max-md:border-border-dark max-md:w-full">
              <a routerLink="/profile" class="flex items-center gap-2.5 no-underline" (click)="closeMenu()">
                @if (auth.user()?.avatarUrl) {
                  <img [src]="auth.user()?.avatarUrl" alt="" class="w-8 h-8 rounded-full object-cover border border-border-dark" />
                } @else {
                  <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[0.8rem] font-bold">
                    {{ auth.user()?.firstName?.charAt(0) }}
                  </div>
                }
                <span class="text-cinema-text text-[0.85rem] font-medium">{{ auth.user()?.firstName }}</span>
              </a>
              <button class="btn btn-ghost btn-sm" (click)="auth.logout(); closeMenu()">Logout</button>
            </div>
          } @else {
            <a routerLink="/login" routerLinkActive="!text-primary"
               class="text-text-secondary no-underline text-[0.9rem] font-medium px-3.5 py-2 rounded-cinema transition-all hover:text-cinema-text hover:bg-bg-surface-light"
               (click)="closeMenu()">Login</a>
            <a routerLink="/register" class="btn btn-primary btn-sm" (click)="closeMenu()">Register</a>
          }
        </div>

        <button class="hamburger hidden max-md:flex" (click)="toggleMenu()" [class.active]="menuOpen()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .nav-links-open {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 68px;
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      padding: 16px;
      gap: 4px;
      box-shadow: var(--shadow);
    }
    .nav-links-open a { width: 100%; padding: 12px 16px; }
    @media (max-width: 768px) {
      .nav-links:not(.nav-links-open) { display: none; }
    }
  `],
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class NavbarComponent {
  menuOpen = signal(false);
  scrolled = false;

  constructor(public auth: AuthService) {}

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }
  onScroll() { this.scrolled = window.scrollY > 20; }
}
