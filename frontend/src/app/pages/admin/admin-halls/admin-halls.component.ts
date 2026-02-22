import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HallService, Hall } from '../../../core/services/hall.service';

@Component({
  selector: 'app-admin-halls',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex justify-between items-start mb-6">
        <div><h1 class="text-[1.6rem] font-bold mb-1">Halls</h1><p class="text-text-secondary">Manage cinema halls and seating</p></div>
        <button class="btn btn-primary" (click)="showForm = !showForm">{{ showForm ? 'Cancel' : '+ Add Hall' }}</button>
      </div>

      @if (showForm) {
        <div class="card p-6 mb-5">
          <h3 class="text-base font-semibold mb-5">New Hall</h3>
          <form (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-2 gap-x-4 max-md:grid-cols-1">
              <div class="form-group"><label>Hall Name</label><input [(ngModel)]="name" name="name" placeholder="e.g. Sala 4" required /></div>
              <div class="form-group"><label>Rows</label><input type="number" [(ngModel)]="rows" name="rows" min="1" max="20" required /></div>
              <div class="form-group"><label>Seats Per Row</label><input type="number" [(ngModel)]="seatsPerRow" name="seatsPerRow" min="1" max="25" required /></div>
              <div class="form-group"><label>VIP Rows (e.g. 9,10)</label><input [(ngModel)]="vipRowsStr" name="vipRows" placeholder="Leave empty for none" /></div>
            </div>
            <button type="submit" class="btn btn-primary">Create Hall</button>
          </form>
        </div>
      }

      <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        @for (hall of halls; track hall.id) {
          <div class="card p-5 text-center">
            <div class="mb-3">
              <svg class="w-10 h-10 text-primary mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
            </div>
            <h3 class="text-base font-semibold mb-4">{{ hall.name }}</h3>
            <div class="flex justify-center gap-5">
              <div class="text-center">
                <span class="block text-[1.2rem] font-bold">{{ hall.rows }}</span>
                <span class="text-text-muted text-xs">Rows</span>
              </div>
              <div class="text-center">
                <span class="block text-[1.2rem] font-bold">{{ hall.seatsPerRow }}</span>
                <span class="text-text-muted text-xs">Seats/Row</span>
              </div>
              <div class="text-center">
                <span class="block text-[1.2rem] font-bold">{{ hall.rows * hall.seatsPerRow }}</span>
                <span class="text-text-muted text-xs">Total</span>
              </div>
            </div>
            <button class="btn btn-outline btn-sm w-full mt-3" (click)="deleteHall(hall)">Delete</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class AdminHallsComponent implements OnInit {
  halls: Hall[] = [];
  name = ''; rows = 8; seatsPerRow = 10; vipRowsStr = '';
  showForm = false;

  constructor(private hallService: HallService) {}

  ngOnInit() { this.loadHalls(); }
  loadHalls() { this.hallService.getAll().subscribe({ next: (h) => this.halls = h }); }

  onSubmit() {
    const vipRows = this.vipRowsStr ? this.vipRowsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) : [];
    this.hallService.create({ name: this.name, rows: this.rows, seatsPerRow: this.seatsPerRow, vipRows }).subscribe({
      next: () => { this.name = ''; this.vipRowsStr = ''; this.showForm = false; this.loadHalls(); },
    });
  }

  deleteHall(hall: Hall) {
    if (!confirm(`Delete "${hall.name}"?`)) return;
    this.hallService.delete(hall.id).subscribe({ next: () => this.loadHalls() });
  }
}
