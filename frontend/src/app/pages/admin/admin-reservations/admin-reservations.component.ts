import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-reservations',
  standalone: true,
  imports: [FormsModule, DatePipe, CurrencyPipe],
  template: `
    <div>
      <h1 class="text-[1.6rem] font-bold mb-1">Reservations</h1>
      <p class="text-text-secondary mb-6">View and manage all customer reservations</p>

      <div class="card px-5 py-4 mb-4">
        <div class="flex gap-4 items-end flex-wrap max-md:flex-col max-md:items-stretch">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-text-muted uppercase tracking-wide">Status</label>
            <select [(ngModel)]="filterStatus" (ngModelChange)="applyFilters()" class="min-w-[160px] max-md:min-w-full px-4 py-3 bg-bg-dark border border-border-dark rounded-cinema text-cinema-text text-[0.95rem] focus:outline-none focus:border-primary">
              <option value="">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-text-muted uppercase tracking-wide">Search</label>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Movie or user..." class="min-w-[160px] max-md:min-w-full px-4 py-3 bg-bg-dark border border-border-dark rounded-cinema text-cinema-text text-[0.95rem] focus:outline-none focus:border-primary" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-text-muted uppercase tracking-wide">Date</label>
            <input type="date" [(ngModel)]="filterDate" (ngModelChange)="applyFilters()" class="min-w-[160px] max-md:min-w-full px-4 py-3 bg-bg-dark border border-border-dark rounded-cinema text-cinema-text text-[0.95rem] focus:outline-none focus:border-primary" />
          </div>
          <button class="btn btn-ghost btn-sm" (click)="clearFilters()">Clear</button>
        </div>
      </div>

      <div class="flex gap-2.5 mb-4">
        <div class="px-3.5 py-1.5 bg-bg-surface border border-border-dark rounded-full text-[0.8rem] text-text-secondary"><strong class="text-cinema-text mr-1">{{ filtered.length }}</strong> results</div>
        <div class="px-3.5 py-1.5 bg-bg-surface border border-border-dark rounded-full text-[0.8rem] text-text-secondary"><strong class="text-success mr-1">{{ confirmedCount }}</strong> confirmed</div>
        <div class="px-3.5 py-1.5 bg-bg-surface border border-border-dark rounded-full text-[0.8rem] text-text-secondary"><strong class="text-error mr-1">{{ cancelledCount }}</strong> cancelled</div>
      </div>

      <div class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Movie</th>
                <th>Hall</th>
                <th>Seat</th>
                <th>Date & Time</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (r of filtered; track r.id) {
                <tr [class.opacity-50]="r.status === 'cancelled'">
                  <td class="text-text-muted text-[0.8rem]">{{ r.id }}</td>
                  <td><strong>{{ r.User?.firstName }} {{ r.User?.lastName }}</strong><br><span class="text-xs text-text-muted">{{ r.User?.email }}</span></td>
                  <td>{{ r.Screening?.Movie?.title }}</td>
                  <td>{{ r.Screening?.Hall?.name }}</td>
                  <td class="text-[#4a90d9] font-semibold">{{ getRowLabel(r.Seat?.row) }}{{ r.Seat?.number }}</td>
                  <td>{{ r.Screening?.startTime | date:'dd.MM.yyyy HH:mm' }}</td>
                  <td>{{ r.Screening?.price | currency:'PLN':'symbol':'1.2-2' }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="r.status === 'confirmed'" [class.badge-error]="r.status === 'cancelled'">
                      {{ r.status }}
                    </span>
                  </td>
                </tr>
              }
              @if (filtered.length === 0) {
                <tr><td colspan="8" class="!text-center !py-10 text-text-muted">No reservations found</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminReservationsComponent implements OnInit {
  reservations: any[] = [];
  filtered: any[] = [];
  filterStatus = '';
  filterDate = '';
  searchQuery = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.loadReservations(); }

  loadReservations() {
    this.adminService.getAllReservations().subscribe({
      next: (data) => { this.reservations = data; this.applyFilters(); },
    });
  }

  applyFilters() {
    let result = [...this.reservations];
    if (this.filterStatus) result = result.filter(r => r.status === this.filterStatus);
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.Screening?.Movie?.title?.toLowerCase().includes(q) ||
        r.User?.firstName?.toLowerCase().includes(q) ||
        r.User?.lastName?.toLowerCase().includes(q) ||
        r.User?.email?.toLowerCase().includes(q)
      );
    }
    if (this.filterDate) {
      result = result.filter(r => r.Screening?.startTime?.startsWith(this.filterDate));
    }
    this.filtered = result;
  }

  clearFilters() { this.filterStatus = ''; this.filterDate = ''; this.searchQuery = ''; this.applyFilters(); }

  get confirmedCount() { return this.filtered.filter(r => r.status === 'confirmed').length; }
  get cancelledCount() { return this.filtered.filter(r => r.status === 'cancelled').length; }

  getRowLabel(row: number): string { return row ? String.fromCharCode(64 + row) : ''; }
}
