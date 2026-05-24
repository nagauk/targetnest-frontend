import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">🏠 RealEstate</a>
        <button class="navbar-toggler" type="button" (click)="toggleCollapse()">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav" [class.show]="isCollapsed">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/properties/for-sale">For Sale</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/properties/for-rent">For Rent</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/search">Search</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <ng-container *ngIf="!authService.isAuthenticated">
              <li class="nav-item">
                <a class="nav-link" routerLink="/login">Login</a>
              </li>
              <li class="nav-item">
                <a class="btn btn-light btn-sm ms-2" routerLink="/register">Register</a>
              </li>
            </ng-container>
            <ng-container *ngIf="authService.isAuthenticated">
              <li class="nav-item">
                <a class="nav-link" routerLink="/create-property">Post Property</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/my-properties">My Properties</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" (click)="toggleDropdown(); $event.preventDefault()">
                  {{ userName }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" [class.show]="isDropdownOpen">
                  <li><a class="dropdown-item" href="#" (click)="logout(); $event.preventDefault()">Logout</a></li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `,
    styles: [`
      .dropdown-menu {
        display: none;
      }
      .dropdown-menu.show {
        display: block;
      }
    `]
})
export class NavbarComponent {
  user: any = null;
  isCollapsed = false;
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  get userName(): string {
    return this.user?.firstName || 'User';
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isDropdownOpen = false;
    this.router.navigate(['/']);
  }
}
