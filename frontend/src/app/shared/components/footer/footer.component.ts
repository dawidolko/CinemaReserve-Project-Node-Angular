import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-bg-surface border-t border-border-dark pt-12 mt-20">
      <div class="max-w-[1280px] mx-auto px-6">
        <div class="grid grid-cols-[2fr_1fr_1fr] gap-12 pb-10 max-md:grid-cols-1 max-md:gap-8">
          <div>
            <a routerLink="/" class="flex items-center gap-2.5 text-[1.2rem] font-bold text-cinema-text no-underline mb-4">
              <svg class="w-7 h-7 text-primary" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2"/>
                <circle cx="20" cy="20" r="6" fill="currentColor"/>
                <circle cx="20" cy="6" r="2.5" fill="currentColor"/>
                <circle cx="20" cy="34" r="2.5" fill="currentColor"/>
                <circle cx="6" cy="20" r="2.5" fill="currentColor"/>
                <circle cx="34" cy="20" r="2.5" fill="currentColor"/>
              </svg>
              <span>Cinema<span class="text-primary">Reserve</span></span>
            </a>
            <p class="text-text-secondary text-[0.9rem] leading-[1.7] max-w-[320px]">{{ footerText }}</p>
          </div>

          <div class="flex flex-col gap-2.5">
            <h4 class="text-cinema-text text-[0.9rem] font-semibold mb-1">Quick Links</h4>
            <a routerLink="/" class="text-text-secondary text-[0.85rem] no-underline transition-colors hover:text-primary">Movies</a>
            <a routerLink="/login" class="text-text-secondary text-[0.85rem] no-underline transition-colors hover:text-primary">Login</a>
            <a routerLink="/register" class="text-text-secondary text-[0.85rem] no-underline transition-colors hover:text-primary">Register</a>
          </div>

          <div class="flex flex-col gap-2.5">
            <h4 class="text-cinema-text text-[0.9rem] font-semibold mb-1">Information</h4>
            <span class="text-text-secondary text-[0.85rem]">Mon-Sun: 10:00 - 23:00</span>
            <span class="text-text-secondary text-[0.85rem]">contact&#64;cinemareserve.pl</span>
            <span class="text-text-secondary text-[0.85rem]">+48 123 456 789</span>
          </div>
        </div>

        <div class="border-t border-border-dark py-5 text-center">
          <span class="text-text-muted text-[0.8rem]">&copy; 2025 CinemaReserve. All rights reserved.</span>
        </div>
      </div>
    </footer>
  `,
  styles: [],
})
export class FooterComponent implements OnInit {
  footerText = 'Your premium cinema booking experience.';

  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getAll().subscribe({
      next: (content) => {
        if (content['footer_text']) this.footerText = content['footer_text'];
      },
    });
  }
}
