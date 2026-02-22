import { Component, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ReservationService, Reservation } from '../../core/services/reservation.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  template: `
    <div class="py-10">
      <div class="max-w-[900px] mx-auto px-6">
        <div class="mb-8">
          <h1 class="text-[1.8rem] font-bold">My Reservations</h1>
          <p class="text-text-secondary mt-1">Manage your cinema bookings</p>
        </div>

        @if (loading) {
          <div class="flex justify-center py-16">
            <div class="w-10 h-10 border-[3px] border-border-dark border-t-primary rounded-full animate-spin"></div>
          </div>
        }

        @if (!loading && reservations.length === 0) {
          <div class="text-center py-16">
            <svg viewBox="0 0 64 64" fill="none" class="w-16 h-16 text-text-muted mx-auto mb-4"><rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" stroke-width="2"/><line x1="8" y1="24" x2="56" y2="24" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="36" r="4" stroke="currentColor" stroke-width="2"/></svg>
            <h3 class="text-cinema-text mb-2">No reservations yet</h3>
            <p class="text-text-muted">Browse our movies and book your first screening!</p>
          </div>
        }

        <div class="flex flex-col gap-3">
          @for (r of reservations; track r.id) {
            <div class="card flex gap-4 p-4 items-center max-sm:flex-col max-sm:text-center"
                 [class.opacity-50]="r.status === 'cancelled'">
              <img [src]="r.Screening?.Movie?.posterUrl" [alt]="r.Screening?.Movie?.title"
                   class="w-[70px] h-[105px] object-cover rounded-cinema shrink-0" />
              <div class="flex-1">
                <div class="flex justify-between items-center mb-2.5 max-sm:flex-col max-sm:gap-2">
                  <h3 class="text-[1.05rem] font-semibold">{{ r.Screening?.Movie?.title }}</h3>
                  <span class="badge" [class.badge-success]="r.status === 'confirmed'" [class.badge-error]="r.status === 'cancelled'">
                    {{ r.status === 'confirmed' ? 'Confirmed' : 'Cancelled' }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-4 max-sm:justify-center">
                  <div>
                    <span class="block text-text-muted text-[0.7rem] uppercase tracking-wide mb-0.5">Date & Time</span>
                    <span class="text-cinema-text text-[0.9rem] font-medium">{{ r.Screening?.startTime | date:'EEE, dd MMM yyyy, HH:mm' }}</span>
                  </div>
                  <div>
                    <span class="block text-text-muted text-[0.7rem] uppercase tracking-wide mb-0.5">Hall</span>
                    <span class="text-cinema-text text-[0.9rem] font-medium">{{ r.Screening?.Hall?.name }}</span>
                  </div>
                  <div>
                    <span class="block text-text-muted text-[0.7rem] uppercase tracking-wide mb-0.5">Seat</span>
                    <span class="text-seat-selected text-[0.9rem] font-medium">{{ getRowLabel(r.Seat?.row) }}{{ r.Seat?.number }}</span>
                  </div>
                  <div>
                    <span class="block text-text-muted text-[0.7rem] uppercase tracking-wide mb-0.5">Price</span>
                    <span class="text-primary text-[0.9rem] font-medium">{{ r.Screening?.price | currency:'PLN':'symbol':'1.2-2' }}</span>
                  </div>
                </div>
              </div>
              <div class="shrink-0">
                @if (r.status === 'confirmed') {
                  <button class="btn btn-outline btn-sm" (click)="cancelReservation(r)">Cancel</button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MyReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;

  constructor(private reservationService: ReservationService) {}

  ngOnInit() { this.loadReservations(); }

  loadReservations() {
    this.reservationService.getMy().subscribe({
      next: (data) => { this.reservations = data; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  getRowLabel(row: number): string { return String.fromCharCode(64 + row); }

  cancelReservation(r: Reservation) {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    this.reservationService.cancel(r.id).subscribe({ next: () => this.loadReservations() });
  }
}
