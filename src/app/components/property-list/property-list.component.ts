import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
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
    selector: 'app-property-list',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container my-5">
      <h2 class="mb-4">{{ pageTitle }}</h2>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Loading properties...</p>
      </div>

      <div *ngIf="!loading && properties.length === 0" class="text-center py-5">
        <p class="text-muted">No properties available.</p>
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
              <a [routerLink]="['/properties', property.id]" class="btn btn-primary w-100">View Details</a>
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
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  pageTitle = 'All Properties';
  currentPage = 0;
  totalPages = 1;
  loading = false;
  listingType: string | null = null;
  placeholderImage = environment.placeholderImage;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) { }

  ngOnInit(): void {
    this.listingType = this.route.snapshot.data['listingType'];
    if (this.listingType === 'SALE') {
      this.pageTitle = 'Properties for Sale';
      this.loadForSale();
    } else if (this.listingType === 'RENT') {
      this.pageTitle = 'Properties for Rent';
      this.loadForRent();
    } else {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.loading = true;
    this.propertyService.getAllProperties(this.currentPage).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.properties = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      },
      error: () => this.loading = false
    });
  }

  loadForSale(): void {
    this.loading = true;
    this.propertyService.getPropertiesForSale(this.currentPage).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.properties = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      },
      error: () => this.loading = false
    });
  }

  loadForRent(): void {
    this.loading = true;
    this.propertyService.getPropertiesForRent(this.currentPage).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success) {
          this.properties = response.data.content;
          this.totalPages = response.data.totalPages;
        }
      },
      error: () => this.loading = false
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

  loadProperties(): void {
    if (this.listingType === 'SALE') {
      this.loadForSale();
    } else if (this.listingType === 'RENT') {
      this.loadForRent();
    } else {
      this.loadAll();
    }
  }
}
