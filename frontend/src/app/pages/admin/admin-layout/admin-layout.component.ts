import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-bg-dark">
      <!-- SIDEBAR -->
      <aside class="bg-bg-surface border-r border-border-dark flex flex-col shrink-0 transition-all duration-300 sticky top-0 h-screen overflow-y-auto max-[900px]:fixed max-[900px]:z-[100] max-[900px]:left-0 max-[900px]:top-0 max-[900px]:bottom-0"
             [class]="collapsed() ? 'w-[68px] max-[900px]:-translate-x-full' : 'w-[260px] max-[900px]:shadow-cinema-lg max-[900px]:translate-x-0'">
        <div class="flex items-center justify-between p-4 border-b border-border-dark min-h-[64px]">
          <a routerLink="/" class="flex items-center gap-2.5 no-underline text-cinema-text text-[1.1rem] font-bold">
            <svg viewBox="0 0 40 40" fill="none" class="w-7 h-7 text-primary shrink-0"><circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="currentColor"/><circle cx="20" cy="6" r="2.5" fill="currentColor"/><circle cx="20" cy="34" r="2.5" fill="currentColor"/><circle cx="6" cy="20" r="2.5" fill="currentColor"/><circle cx="34" cy="20" r="2.5" fill="currentColor"/></svg>
            @if (!collapsed()) { <span>Cinema<span class="text-primary">Reserve</span></span> }
          </a>
          <button class="bg-transparent border-0 cursor-pointer p-1 text-text-muted" (click)="toggleSidebar()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[18px] h-[18px] transition-transform duration-300" [class.rotate-180]="collapsed()"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        </div>

        <nav class="flex-1 p-2">
          <div class="mt-4 mb-1">@if (!collapsed()) { <span class="block px-3 text-text-muted text-[0.7rem] uppercase tracking-widest font-semibold">Main</span> }</div>
          <a routerLink="/admin/dashboard" routerLinkActive="!bg-primary-light !text-primary" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            @if (!collapsed()) { <span>Dashboard</span> }
          </a>
          <a routerLink="/admin/movies" routerLinkActive="!bg-primary-light !text-primary" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            @if (!collapsed()) { <span>Movies</span> }
          </a>
          <a routerLink="/admin/screenings" routerLinkActive="!bg-primary-light !text-primary" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            @if (!collapsed()) { <span>Screenings</span> }
          </a>
          <a routerLink="/admin/halls" routerLinkActive="!bg-primary-light !text-primary" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
            @if (!collapsed()) { <span>Halls</span> }
          </a>

          <div class="mt-4 mb-1">@if (!collapsed()) { <span class="block px-3 text-text-muted text-[0.7rem] uppercase tracking-widest font-semibold">Management</span> }</div>
          <a routerLink="/admin/users" routerLinkActive="!bg-primary-light !text-primary" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            @if (!collapsed()) { <span>Users</span> }
          </a>
          <a routerLink="/admin/reservations" routerLinkActive="!bg-primary-light !text-primary" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><path d="M15 5v2M9 5v2M4 10h16M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M9 14l2 2 4-4"/></svg>
            @if (!collapsed()) { <span>Reservations</span> }
          </a>

          <div class="mt-4 mb-1">@if (!collapsed()) { <span class="block px-3 text-text-muted text-[0.7rem] uppercase tracking-widest font-semibold">CMS</span> }</div>
          <a routerLink="/admin/content" routerLinkActive="!bg-primary-light !text-primary" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            @if (!collapsed()) { <span>Content</span> }
          </a>
          <a routerLink="/admin/sections" routerLinkActive="!bg-primary-light !text-primary" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            @if (!collapsed()) { <span>Sections</span> }
          </a>
        </nav>

        <div class="p-2 border-t border-border-dark">
          <a routerLink="/" class="nav-link" [class.justify-center]="collapsed()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 shrink-0"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            @if (!collapsed()) { <span>Back to Site</span> }
          </a>
        </div>
      </aside>

      <!-- MAIN -->
      <div class="flex-1 flex flex-col min-w-0">
        <header class="flex justify-between items-center px-6 h-16 bg-bg-surface border-b border-border-dark sticky top-0 z-10">
          <div class="flex items-center gap-3">
            <button class="hidden max-[900px]:block bg-transparent border-0 cursor-pointer text-cinema-text" (click)="toggleSidebar()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-[22px] h-[22px]"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h2 class="text-[1.1rem] font-semibold">Admin Panel</h2>
          </div>
          <div class="flex items-center gap-2.5">
            <div class="w-[34px] h-[34px] rounded-full bg-primary text-white flex items-center justify-center font-bold text-[0.85rem]">
              {{ auth.user()?.firstName?.charAt(0) }}
            </div>
            <span class="text-text-secondary text-[0.9rem]">{{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</span>
          </div>
        </header>

        <div class="p-6 flex-1">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nav-link {
      @apply flex items-center gap-3 px-3 py-2.5 rounded-cinema text-text-secondary no-underline text-[0.9rem] font-medium transition-all mb-0.5;
      &:hover { @apply bg-bg-surface-light text-cinema-text; }
    }
  `],
})
export class AdminLayoutComponent {
  collapsed = signal(false);

  constructor(public auth: AuthService) {}

  toggleSidebar() { this.collapsed.update(v => !v); }
}
