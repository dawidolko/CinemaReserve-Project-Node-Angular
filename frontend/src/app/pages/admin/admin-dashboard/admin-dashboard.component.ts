import { Component, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  template: `
    <div>
      <h1 class="text-[1.6rem] font-bold mb-1">Dashboard</h1>
      <p class="text-text-secondary mb-7">Welcome back. Here's what's happening today.</p>

      <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-7">
        <div class="flex items-center gap-4 p-5 bg-bg-surface border border-border-dark rounded-cinema-lg">
          <div class="w-12 h-12 rounded-cinema-lg flex items-center justify-center bg-primary-light text-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          </div>
          <div>
            <span class="block text-2xl font-bold leading-tight">{{ stats?.totalMovies || 0 }}</span>
            <span class="text-text-muted text-[0.8rem]">Total Movies</span>
          </div>
        </div>
        <div class="flex items-center gap-4 p-5 bg-bg-surface border border-border-dark rounded-cinema-lg">
          <div class="w-12 h-12 rounded-cinema-lg flex items-center justify-center" style="background: rgba(74,144,217,0.12); color: #4a90d9">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <span class="block text-2xl font-bold leading-tight">{{ stats?.todayScreenings || 0 }}</span>
            <span class="text-text-muted text-[0.8rem]">Today's Screenings</span>
          </div>
        </div>
        <div class="flex items-center gap-4 p-5 bg-bg-surface border border-border-dark rounded-cinema-lg">
          <div class="w-12 h-12 rounded-cinema-lg flex items-center justify-center bg-success/10 text-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><path d="M15 5v2M9 5v2M4 10h16M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M9 14l2 2 4-4"/></svg>
          </div>
          <div>
            <span class="block text-2xl font-bold leading-tight">{{ stats?.todayReservations || 0 }}</span>
            <span class="text-text-muted text-[0.8rem]">Today's Reservations</span>
          </div>
        </div>
        <div class="flex items-center gap-4 p-5 bg-bg-surface border border-border-dark rounded-cinema-lg">
          <div class="w-12 h-12 rounded-cinema-lg flex items-center justify-center bg-accent/10 text-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div>
            <span class="block text-2xl font-bold leading-tight">{{ stats?.totalRevenue | currency:'PLN':'symbol':'1.0-0' }}</span>
            <span class="text-text-muted text-[0.8rem]">Total Revenue</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-[2fr_1fr] gap-4 max-md:grid-cols-1">
        <div class="card p-5">
          <h3 class="text-base font-semibold mb-4">Recent Reservations</h3>
          <div class="overflow-x-auto">
            <table class="admin-table">
              <thead><tr><th>User</th><th>Movie</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                @for (r of recentReservations; track r.id) {
                  <tr>
                    <td>{{ r.User?.firstName }} {{ r.User?.lastName }}</td>
                    <td>{{ r.Screening?.Movie?.title }}</td>
                    <td>{{ r.createdAt | date:'dd MMM, HH:mm' }}</td>
                    <td><span class="badge" [class.badge-success]="r.status==='confirmed'" [class.badge-error]="r.status==='cancelled'">{{ r.status }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="card p-5">
          <h3 class="text-base font-semibold mb-4">Quick Stats</h3>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center py-3 border-b border-border-dark">
              <span class="text-text-secondary text-[0.85rem]">Total Users</span>
              <span class="text-[1.1rem] font-semibold">{{ stats?.totalUsers || 0 }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-border-dark">
              <span class="text-text-secondary text-[0.85rem]">Total Reservations</span>
              <span class="text-[1.1rem] font-semibold">{{ stats?.totalReservations || 0 }}</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="text-text-secondary text-[0.85rem]">Avg Revenue/Ticket</span>
              <span class="text-[1.1rem] font-semibold">{{ avgRevenue | currency:'PLN':'symbol':'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminDashboardComponent implements OnInit {
  stats: any;
  recentReservations: any[] = [];
  avgRevenue = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getStats().subscribe({ next: (s) => {
      this.stats = s;
      this.avgRevenue = s.totalReservations > 0 ? s.totalRevenue / s.totalReservations : 0;
    }});
    this.adminService.getAllReservations().subscribe({
      next: (r) => this.recentReservations = r.slice(0, 10),
    });
  }
}
