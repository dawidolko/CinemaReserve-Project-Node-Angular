import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="flex min-h-[calc(100vh-68px)]">
      <div class="flex-1 flex items-center justify-center border-r border-border-dark max-md:hidden"
           style="background: linear-gradient(135deg, var(--bg-surface) 0%, #1a0a0c 100%)">
        <div class="text-center text-primary">
          <svg class="w-20 h-20 mx-auto mb-6" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" stroke="currentColor" stroke-width="2"/><circle cx="40" cy="40" r="12" fill="currentColor"/><circle cx="40" cy="12" r="4" fill="currentColor"/><circle cx="40" cy="68" r="4" fill="currentColor"/><circle cx="12" cy="40" r="4" fill="currentColor"/><circle cx="68" cy="40" r="4" fill="currentColor"/></svg>
          <h2 class="text-3xl text-cinema-text">Cinema<span class="text-primary">Reserve</span></h2>
          <p class="text-text-muted mt-2">Join the best cinema booking platform</p>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center p-10">
        <div class="w-full max-w-[440px]">
          <h1 class="text-[1.8rem] font-bold mb-2">Create Account</h1>
          <p class="text-text-secondary mb-8">Register to start booking</p>
          <form (ngSubmit)="onSubmit()">
            <div class="flex gap-4 max-md:flex-col max-md:gap-0">
              <div class="form-group flex-1">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" [(ngModel)]="firstName" name="firstName" placeholder="Jan" required />
              </div>
              <div class="form-group flex-1">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" [(ngModel)]="lastName" name="lastName" placeholder="Kowalski" required />
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" placeholder="your&#64;email.com" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" [(ngModel)]="password" name="password" placeholder="Min 6 characters" required />
            </div>
            @if (error) {
              <div class="bg-error/10 text-error px-4 py-2.5 rounded-cinema mb-4 text-[0.85rem] text-center">{{ error }}</div>
            }
            <button type="submit" class="btn btn-primary btn-lg w-full" [disabled]="loading">
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>
          <p class="text-center text-text-secondary mt-6 text-[0.9rem]">
            Already have an account? <a routerLink="/login" class="text-primary font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class RegisterComponent {
  firstName = ''; lastName = ''; email = ''; password = ''; error = ''; loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true; this.error = '';
    this.authService.register({ email: this.email, password: this.password, firstName: this.firstName, lastName: this.lastName }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => { this.error = err.error?.error || 'Registration failed.'; this.loading = false; },
    });
  }
}
