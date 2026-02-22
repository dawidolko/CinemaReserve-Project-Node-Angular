import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ScreeningService } from '../../core/services/screening.service';
import { ReservationService } from '../../core/services/reservation.service';

interface SeatInfo {
  id: number;
  row: number;
  number: number;
  seatType: 'standard' | 'vip';
  taken: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-seat-select',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  template: `
    <div class="py-8">
      <div class="max-w-[1200px] mx-auto px-6">
        @if (screening) {
          <div class="text-center mb-8">
            <h1 class="text-[1.8rem] font-bold mb-3">{{ screening.Movie?.title }}</h1>
            <div class="flex justify-center items-center gap-3 flex-wrap">
              <span class="badge badge-primary">{{ screening.startTime | date:'EEE, dd MMM yyyy' }}</span>
              <span class="badge badge-accent">{{ screening.startTime | date:'HH:mm' }}</span>
              <span class="text-text-secondary text-[0.9rem]">{{ screening.Hall?.name }}</span>
              <span class="text-text-secondary text-[0.9rem]">{{ screening.price }} PLN / seat</span>
            </div>
          </div>

          <div class="grid grid-cols-[1fr_300px] gap-8 items-start max-[900px]:grid-cols-1">
            <div class="flex flex-col items-center">
              <!-- Screen -->
              <div class="text-center mb-8 w-[70%]">
                <div class="py-2.5 text-text-muted text-xs tracking-[4px] font-medium"
                     style="background: linear-gradient(180deg, rgba(74,144,217,0.4), rgba(74,144,217,0.05)); border-radius: 4px 4px 50% 50%">
                  SCREEN
                </div>
                <div class="h-5" style="background: radial-gradient(ellipse at center, rgba(74,144,217,0.1) 0%, transparent 70%)"></div>
              </div>

              <!-- Seat Map -->
              <div class="flex flex-col items-center gap-[5px] mb-6">
                @for (row of seatRows; track row.rowNumber) {
                  <div class="flex items-center gap-2">
                    <span class="text-text-muted text-xs w-[18px] text-center font-medium">{{ getRowLabel(row.rowNumber) }}</span>
                    <div class="flex gap-1">
                      @for (seat of row.seats; track seat.id) {
                        <button
                          class="seat"
                          [class.seat-selected]="seat.selected"
                          [class.seat-taken]="seat.taken"
                          [class.seat-vip]="seat.seatType === 'vip' && !seat.selected && !seat.taken"
                          [disabled]="seat.taken"
                          (click)="toggleSeat(seat)"
                          [title]="getRowLabel(seat.row) + seat.number + (seat.seatType === 'vip' ? ' (VIP)' : '')">
                          {{ seat.number }}
                        </button>
                      }
                    </div>
                    <span class="text-text-muted text-xs w-[18px] text-center font-medium">{{ getRowLabel(row.rowNumber) }}</span>
                  </div>
                }
              </div>

              <!-- Legend -->
              <div class="flex justify-center gap-5">
                <div class="flex items-center gap-1.5 text-text-secondary text-[0.8rem]"><span class="legend-dot bg-seat-free"></span> Available</div>
                <div class="flex items-center gap-1.5 text-text-secondary text-[0.8rem]"><span class="legend-dot bg-seat-selected"></span> Selected</div>
                <div class="flex items-center gap-1.5 text-text-secondary text-[0.8rem]"><span class="legend-dot bg-bg-surface-light opacity-50"></span> Taken</div>
                <div class="flex items-center gap-1.5 text-text-secondary text-[0.8rem]"><span class="legend-dot bg-seat-vip"></span> VIP</div>
              </div>
            </div>

            <!-- Summary -->
            <div class="card p-6 sticky top-[90px] max-[900px]:static">
              <h3 class="text-[1.1rem] font-semibold mb-5">Booking Summary</h3>

              <div class="flex gap-3 items-center mb-5 pb-4 border-b border-border-dark">
                <img [src]="screening.Movie?.posterUrl" alt="" class="w-[50px] h-[75px] object-cover rounded" />
                <div>
                  <strong class="block text-[0.9rem]">{{ screening.Movie?.title }}</strong>
                  <span class="text-text-muted text-[0.8rem]">{{ screening.startTime | date:'dd MMM, HH:mm' }}</span>
                </div>
              </div>

              @if (selectedSeats.length > 0) {
                <div class="mb-5">
                  <div class="text-text-secondary text-[0.8rem] mb-2">Selected Seats</div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (seat of selectedSeats; track seat.id) {
                      <span class="px-2.5 py-1 rounded text-[0.8rem] font-semibold"
                            [class]="seat.seatType === 'vip' ? 'bg-accent/15 text-accent' : 'bg-seat-selected/15 text-seat-selected'">
                        {{ getRowLabel(seat.row) }}{{ seat.number }}
                      </span>
                    }
                  </div>
                </div>

                <div class="flex justify-between items-center py-4 mb-4 border-t border-border-dark">
                  <span class="text-text-secondary text-[0.9rem]">Total ({{ selectedSeats.length }} seats)</span>
                  <strong class="text-cinema-text text-[1.2rem]">{{ selectedSeats.length * screening.price | currency:'PLN':'symbol':'1.2-2' }}</strong>
                </div>

                <button class="btn btn-primary btn-lg w-full" (click)="confirmBooking()" [disabled]="booking">
                  {{ booking ? 'Booking...' : 'Confirm Reservation' }}
                </button>
              } @else {
                <p class="text-text-muted text-[0.85rem] text-center py-5">Select seats on the map to begin booking.</p>
              }

              @if (error) { <div class="mt-4 p-3 rounded-cinema text-center text-[0.85rem] bg-error/10 text-error">{{ error }}</div> }
              @if (success) { <div class="mt-4 p-3 rounded-cinema text-center text-[0.85rem] bg-success/10 text-success">Reservation confirmed! Redirecting...</div> }
            </div>
          </div>
        } @else {
          <div class="flex justify-center py-24">
            <div class="w-10 h-10 border-[3px] border-border-dark border-t-primary rounded-full animate-spin"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .seat {
      background: #1e6b4a;
      &:hover:not(:disabled) { transform: scale(1.12); background: #28a06a; }
    }
    .seat-selected { background: #4a90d9 !important; transform: scale(1.05); box-shadow: 0 0 10px rgba(74,144,217,0.4); }
    .seat-taken { background: var(--bg-surface-light) !important; cursor: not-allowed; opacity: 0.5; color: var(--text-muted); }
    .seat-vip { background: #b8860b; &:hover:not(:disabled) { background: #d4a843; } }
    .legend-dot { width: 18px; height: 18px; border-radius: 4px 4px 2px 2px; }

    @media (max-width: 900px) {
      .seat { width: 26px; height: 26px; font-size: 0.6rem; }
    }
  `],
})
export class SeatSelectComponent implements OnInit {
  screening: any;
  seatRows: { rowNumber: number; seats: SeatInfo[] }[] = [];
  selectedSeats: SeatInfo[] = [];
  booking = false;
  error = '';
  success = false;

  constructor(private route: ActivatedRoute, private router: Router, private screeningService: ScreeningService, private reservationService: ReservationService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.screeningService.getById(id).subscribe({ next: (data) => { this.screening = data; this.buildSeatMap(data); } });
  }

  private buildSeatMap(data: any) {
    const takenIds = new Set(data.takenSeatIds || []);
    const seats: SeatInfo[] = (data.Hall?.Seats || []).map((s: any) => ({
      id: s.id, row: s.row, number: s.number, seatType: s.seatType, taken: takenIds.has(s.id), selected: false,
    }));
    const rowMap = new Map<number, SeatInfo[]>();
    for (const seat of seats) { if (!rowMap.has(seat.row)) rowMap.set(seat.row, []); rowMap.get(seat.row)!.push(seat); }
    this.seatRows = Array.from(rowMap.entries()).sort(([a], [b]) => a - b).map(([rowNumber, rowSeats]) => ({
      rowNumber, seats: rowSeats.sort((a, b) => a.number - b.number),
    }));
  }

  getRowLabel(row: number): string { return String.fromCharCode(64 + row); }

  toggleSeat(seat: SeatInfo) {
    if (seat.taken) return;
    seat.selected = !seat.selected;
    this.selectedSeats = this.seatRows.flatMap(r => r.seats).filter(s => s.selected);
  }

  confirmBooking() {
    if (this.selectedSeats.length === 0) return;
    this.booking = true;
    this.error = '';
    this.reservationService.create(this.screening.id, this.selectedSeats.map(s => s.id)).subscribe({
      next: () => { this.success = true; setTimeout(() => this.router.navigate(['/my-reservations']), 2000); },
      error: (err) => { this.error = err.error?.error || 'Failed to create reservation.'; this.booking = false; },
    });
  }
}
