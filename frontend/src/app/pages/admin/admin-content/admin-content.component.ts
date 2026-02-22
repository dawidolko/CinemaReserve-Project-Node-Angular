import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <h1 class="text-[1.6rem] font-bold mb-1">CMS Content</h1>
      <p class="text-text-secondary mb-6">Edit website text content — hero section, footer, promotions</p>

      @if (saving) {
        <div class="fixed top-5 right-5 bg-success text-white px-6 py-3 rounded-cinema text-[0.85rem] font-medium z-[1000] animate-[fadeIn_0.3s_ease]">Saved successfully!</div>
      }

      <div class="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4 max-md:grid-cols-1">
        @for (item of contentItems; track item.key) {
          <div class="card p-0 overflow-hidden">
            <div class="flex justify-between items-center px-5 py-3.5 bg-bg-surface-light border-b border-border-dark">
              <div class="font-semibold text-cinema-text text-[0.9rem]">{{ item.key }}</div>
              <span class="px-2.5 py-[3px] bg-primary-light text-primary rounded-xl text-[0.7rem] uppercase font-semibold">{{ item.type }}</span>
            </div>
            <div class="px-5 py-4">
              @if (item.type === 'text') {
                <textarea [(ngModel)]="item.value" rows="3" class="w-full px-3.5 py-2.5 bg-bg-dark border border-border-dark rounded-cinema text-cinema-text text-[0.85rem] resize-y font-[inherit] focus:outline-none focus:border-primary"></textarea>
              } @else {
                <textarea [(ngModel)]="item.value" rows="6" class="w-full px-3.5 py-2.5 bg-bg-dark border border-border-dark rounded-cinema text-cinema-text text-[0.8rem] resize-y font-mono focus:outline-none focus:border-primary"></textarea>
              }
            </div>
            <div class="px-5 py-3 border-t border-border-dark flex justify-end">
              <button class="btn btn-primary btn-sm" (click)="save(item)">Save</button>
            </div>
          </div>
        }
      </div>

      @if (contentItems.length === 0) {
        <div class="card p-10 text-center text-text-muted">
          <p>No CMS content entries found. Add content through the seed or API.</p>
        </div>
      }
    </div>
  `,
  styles: [],
})
export class AdminContentComponent implements OnInit {
  contentItems: { key: string; value: string; type: string }[] = [];
  saving = false;

  constructor(private contentService: ContentService) {}

  ngOnInit() { this.loadContent(); }

  loadContent() {
    this.contentService.getAll().subscribe({
      next: (data: Record<string, string>) => {
        this.contentItems = Object.entries(data).map(([key, value]) => ({
          key,
          value: value as string,
          type: this.guessType(key, value as string),
        }));
      },
    });
  }

  save(item: { key: string; value: string }) {
    this.contentService.update(item.key, item.value).subscribe({
      next: () => { this.saving = true; setTimeout(() => this.saving = false, 2000); },
    });
  }

  private guessType(key: string, value: string): string {
    if (value.startsWith('{') || value.startsWith('[')) return 'json';
    if (value.includes('<')) return 'html';
    return 'text';
  }
}
