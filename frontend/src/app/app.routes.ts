import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'movie/:id', loadComponent: () => import('./pages/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent) },
  { path: 'screening/:id/seats', loadComponent: () => import('./pages/seat-select/seat-select.component').then(m => m.SeatSelectComponent), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'my-reservations', loadComponent: () => import('./pages/my-reservations/my-reservations.component').then(m => m.MyReservationsComponent), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'movies', loadComponent: () => import('./pages/admin/admin-movies/admin-movies.component').then(m => m.AdminMoviesComponent) },
      { path: 'screenings', loadComponent: () => import('./pages/admin/admin-screenings/admin-screenings.component').then(m => m.AdminScreeningsComponent) },
      { path: 'halls', loadComponent: () => import('./pages/admin/admin-halls/admin-halls.component').then(m => m.AdminHallsComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'reservations', loadComponent: () => import('./pages/admin/admin-reservations/admin-reservations.component').then(m => m.AdminReservationsComponent) },
      { path: 'content', loadComponent: () => import('./pages/admin/admin-content/admin-content.component').then(m => m.AdminContentComponent) },
      { path: 'sections', loadComponent: () => import('./pages/admin/admin-sections/admin-sections.component').then(m => m.AdminSectionsComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
