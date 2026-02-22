import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div>
      <h1 class="text-[1.6rem] font-bold mb-1">Users</h1>
      <p class="text-text-secondary mb-6">Manage user accounts and roles</p>

      <div class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Registered</th><th>Actions</th></tr></thead>
            <tbody>
              @for (user of users; track user.id) {
                <tr>
                  <td><strong>{{ user.firstName }} {{ user.lastName }}</strong></td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" [class.badge-primary]="user.role==='admin'" [class.badge-accent]="user.role==='user'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>{{ user.createdAt | date:'dd.MM.yyyy' }}</td>
                  <td>
                    <select [ngModel]="user.role" (ngModelChange)="changeRole(user, $event)" class="px-2.5 py-1.5 bg-bg-dark border border-border-dark rounded-cinema text-cinema-text text-[0.8rem] focus:outline-none focus:border-primary">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.loadUsers(); }
  loadUsers() { this.adminService.getUsers().subscribe({ next: (u) => this.users = u }); }

  changeRole(user: any, role: string) {
    this.adminService.updateUserRole(user.id, role).subscribe({ next: () => this.loadUsers() });
  }
}
