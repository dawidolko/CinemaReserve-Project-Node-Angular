import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';

interface Section {
  id: number;
  sectionKey: string;
  title: string;
  position: number;
  isVisible: boolean;
}

@Component({
  selector: 'app-admin-sections',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-[1.6rem] font-bold mb-1">Sections</h1>
          <p class="text-text-secondary">Reorder and toggle visibility of home page sections</p>
        </div>
        <button class="btn btn-primary" (click)="saveOrder()" [disabled]="saving">
          {{ saving ? 'Saving...' : 'Save Order' }}
        </button>
      </div>

      @if (saved) {
        <div class="fixed top-5 right-5 bg-success text-white px-6 py-3 rounded-cinema text-[0.85rem] font-medium z-[1000] animate-[fadeIn_0.3s_ease]">Section order saved!</div>
      }

      <div class="flex flex-col gap-2">
        @for (section of sections; track section.id; let i = $index) {
          <div class="card flex items-center gap-4 px-5 py-4 transition-opacity" [class.opacity-50]="!section.isVisible">
            <div class="text-text-muted cursor-grab shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/>
                <circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/>
                <circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/>
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-semibold text-cinema-text text-[0.95rem]">{{ section.title }}</div>
              <div class="text-xs text-text-muted mt-0.5 font-mono">{{ section.sectionKey }}</div>
            </div>
            <div class="text-center shrink-0 max-md:hidden">
              <span class="block text-[0.65rem] text-text-muted uppercase tracking-wide">Position</span>
              <span class="text-[1.1rem] font-bold text-primary">{{ section.position }}</span>
            </div>
            <div class="flex flex-col gap-0.5 shrink-0">
              <button class="w-7 h-7 flex items-center justify-center bg-bg-surface-light border border-border-dark rounded-md text-text-secondary cursor-pointer transition-all hover:enabled:border-primary hover:enabled:text-primary disabled:opacity-30 disabled:cursor-not-allowed" (click)="moveUp(i)" [disabled]="i === 0" title="Move up">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
              </button>
              <button class="w-7 h-7 flex items-center justify-center bg-bg-surface-light border border-border-dark rounded-md text-text-secondary cursor-pointer transition-all hover:enabled:border-primary hover:enabled:text-primary disabled:opacity-30 disabled:cursor-not-allowed" (click)="moveDown(i)" [disabled]="i === sections.length - 1" title="Move down">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            </div>
            <label class="flex items-center gap-2 cursor-pointer shrink-0">
              <input type="checkbox" [(ngModel)]="section.isVisible" class="hidden" />
              <span class="toggle-slider"></span>
              <span class="text-[0.8rem] text-text-secondary min-w-[50px]">{{ section.isVisible ? 'Visible' : 'Hidden' }}</span>
            </label>
          </div>
        }
      </div>

      @if (sections.length === 0) {
        <div class="card p-10 text-center text-text-muted">
          <p>No sections configured. Add sections through the seed or API.</p>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class AdminSectionsComponent implements OnInit {
  sections: Section[] = [];
  saving = false;
  saved = false;

  constructor(private contentService: ContentService) {}

  ngOnInit() { this.loadSections(); }

  loadSections() {
    this.contentService.getSections().subscribe({
      next: (data: Section[]) => {
        this.sections = data.sort((a, b) => a.position - b.position);
      },
    });
  }

  moveUp(index: number) {
    if (index <= 0) return;
    [this.sections[index - 1], this.sections[index]] = [this.sections[index], this.sections[index - 1]];
    this.recalcPositions();
  }

  moveDown(index: number) {
    if (index >= this.sections.length - 1) return;
    [this.sections[index], this.sections[index + 1]] = [this.sections[index + 1], this.sections[index]];
    this.recalcPositions();
  }

  recalcPositions() {
    this.sections.forEach((s, i) => s.position = i + 1);
  }

  saveOrder() {
    this.saving = true;
    const payload = this.sections.map(s => ({ id: s.id, position: s.position, isVisible: s.isVisible }));
    this.contentService.updateSections(payload).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
        setTimeout(() => this.saved = false, 2000);
      },
      error: () => this.saving = false,
    });
  }
}
