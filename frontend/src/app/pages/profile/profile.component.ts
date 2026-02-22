import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="py-10">
      <div class="max-w-[560px] mx-auto px-6">
        <h1 class="text-[1.6rem] font-bold mb-1">My Profile</h1>
        <p class="text-text-secondary mb-7">Manage your account settings</p>

        @if (success) {
          <div class="mb-4 p-3 rounded-cinema text-center text-[0.85rem] bg-success/10 text-success">Profile updated successfully!</div>
        }
        @if (error) {
          <div class="mb-4 p-3 rounded-cinema text-center text-[0.85rem] bg-error/10 text-error">{{ error }}</div>
        }

        <div class="card p-6">
          <!-- Avatar Preview -->
          <div class="flex flex-col items-center mb-6">
            @if (form.avatarUrl) {
              <img [src]="form.avatarUrl" alt="Avatar" class="w-20 h-20 rounded-full object-cover border-2 border-border-dark mb-2" />
            } @else {
              <div class="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-2">
                {{ form.firstName?.charAt(0) || '?' }}
              </div>
            }
            <span class="text-text-muted text-[0.8rem]">{{ form.firstName }} {{ form.lastName }}</span>
          </div>

          <div class="form-group">
            <label>Avatar URL</label>
            <input type="url" [(ngModel)]="form.avatarUrl" placeholder="https://example.com/photo.jpg" />
          </div>

          <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" [(ngModel)]="form.firstName" required />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" [(ngModel)]="form.lastName" required />
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="form.email" required />
          </div>

          <div class="form-group">
            <label>New Password <span class="text-text-muted font-normal">(leave empty to keep current)</span></label>
            <input type="password" [(ngModel)]="form.password" placeholder="Enter new password..." />
          </div>

          <button class="btn btn-primary btn-lg w-full mt-2" (click)="save()" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  form = { firstName: '', lastName: '', email: '', avatarUrl: '', password: '' };
  saving = false;
  success = false;
  error = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.form.firstName = user.firstName;
      this.form.lastName = user.lastName;
      this.form.email = user.email;
      this.form.avatarUrl = user.avatarUrl || '';
    }
  }

  save() {
    this.saving = true;
    this.error = '';
    this.success = false;

    const data: any = {
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      avatarUrl: this.form.avatarUrl,
    };
    if (this.form.password) data.password = this.form.password;

    this.auth.updateProfile(data).subscribe({
      next: () => {
        this.saving = false;
        this.success = true;
        this.form.password = '';
        setTimeout(() => this.success = false, 3000);
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.error || 'Failed to update profile.';
      },
    });
  }
}
