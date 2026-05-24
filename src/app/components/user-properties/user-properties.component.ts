import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

interface Property {
  id: number;
  title: string;
  price: number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  listingType: string;
  imageUrl: string;
}

@Component({
    selector: 'app-user-properties',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container my-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>My Properties</h2>
        <a routerLink="/create-property" class="btn btn-primary">+ Post New Property</a>
      </div>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading your properties...</p>
      </div>

      <div *ngIf="!loading && properties.length === 0" class="text-center py-5">
        <p class="text-muted fs-5">You haven't posted any properties yet.</p>
        <a routerLink="/create-property" class="btn btn-primary mt-2">Post Your First Property</a>
      </div>

      <div class="row g-4" *ngIf="!loading && properties.length > 0">
        <div class="col-md-4" *ngFor="let property of properties">
          <div class="card property-card h-100">
            <img [src]="property.imageUrl || placeholderImage" class="card-img-top" alt="{{property.title}}">
            <span class="property-badge" [class.badge-sale]="property.listingType === 'SALE'" [class.badge-rent]="property.listingType === 'RENT'">
              {{ property.listingType === 'SALE' ? 'FOR SALE' : 'FOR RENT' }}
            </span>
            <div class="card-body">
              <h5 class="card-title">{{property.title}}</h5>
              <p class="property-price">\${{property.price | number}}</p>
              <p class="card-text text-muted">{{property.city}}, {{property.state}}</p>
              <div class="property-features">
                <span>🛏️ {{property.bedrooms}} Beds</span>
                <span>🛁 {{property.bathrooms}} Baths</span>
                <span>📐 {{property.squareFeet | number}} sqft</span>
              </div>
            </div>
            <div class="card-footer bg-white border-0">
              <a [routerLink]="['/properties', property.id]" class="btn btn-outline-primary w-100 mb-2">View</a>
              <a [routerLink]="['/create-property']" [queryParams]="{edit: property.id}" class="btn btn-outline-secondary w-100 mb-2">Edit</a>
              <button class="btn btn-outline-danger w-100" (click)="deleteProperty(property)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-4" *ngIf="totalPages > 1">
        <button class="btn btn-outline-primary" (click)="previousPage()" [disabled]="currentPage === 0">Previous</button>
        <span>Page {{currentPage + 1}} of {{totalPages}}</span>
        <button class="btn btn-outline-primary" (click)="nextPage()" [disabled]="currentPage >= totalPages - 1">Next</button>
      </div>
    </div>
  `
})
export class UserPropertiesComponent implements OnInit {
  properties: Property[] = [];
  loading = false;
  currentPage = 0;
  totalPages = 1;
  userId: number | null = null;
  placeholderImage = environment.placeholderImage;

  constructor(
    private authService: AuthService,
    private propertyService: PropertyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.loadProperties();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadProperties(): void {
    if (!this.userId) return;

    this.loading = true;
    this.propertyService.getUserProperties(this.userId, this.currentPage).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.properties = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProperties();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProperties();
    }
  }

  deleteProperty(property: any): void {
    if (confirm(`Are you sure you want to delete "${property.title}"?`)) {
      this.propertyService.deleteProperty(property.id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadProperties();
          }
        },
        error: () => alert('Error deleting property')
      });
    }
  }
}
