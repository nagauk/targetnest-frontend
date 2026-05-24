import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
    selector: 'app-home',
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Find Your Dream Property</h1>
            <p class="lead mb-4">Discover the perfect place to call home. Browse thousands of properties for sale and rent.</p>
            <div class="d-flex gap-3">
              <a routerLink="/properties/for-sale" class="btn btn-light btn-lg">Buy</a>
              <a routerLink="/properties/for-rent" class="btn btn-outline-light btn-lg">Rent</a>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="search-box">
              <h3 class="mb-4 text-dark">Quick Search</h3>
              <form (submit)="onSearch(); $event.preventDefault()">
                <div class="mb-3">
                  <input type="text" class="form-control" placeholder="Location, keyword..." [(ngModel)]="searchCriteria.keyword" name="keyword">
                </div>
                <div class="row g-2">
                  <div class="col-md-6">
                    <select class="form-select" [(ngModel)]="searchCriteria.listingType" name="listingType">
                      <option value="">All Types</option>
                      <option value="SALE">For Sale</option>
                      <option value="RENT">For Rent</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <select class="form-select" [(ngModel)]="searchCriteria.propertyType" name="propertyType">
                      <option value="">Property Type</option>
                      <option value="HOUSE">House</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="CONDO">Condo</option>
                      <option value="TOWNHOUSE">Townhouse</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </select>
                  </div>
                </div>
                <div class="row g-2 mt-2">
                  <div class="col-md-6">
                    <input type="number" class="form-control" placeholder="Min Price" [(ngModel)]="searchCriteria.minPrice" name="minPrice">
                  </div>
                  <div class="col-md-6">
                    <input type="number" class="form-control" placeholder="Max Price" [(ngModel)]="searchCriteria.maxPrice" name="maxPrice">
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100 mt-3" [disabled]="isSearching">
                  {{ isSearching ? 'Searching...' : 'Search Properties' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container my-5">
      <h2 class="text-center mb-4">Featured Properties</h2>

      <div *ngIf="isLoadingFeatured" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div *ngIf="!isLoadingFeatured && featuredProperties.length === 0" class="text-center py-5">
        <p class="text-muted">No featured properties available.</p>
      </div>

      <div class="row g-4" *ngIf="featuredProperties.length > 0">
        <div class="col-md-4" *ngFor="let property of featuredProperties">
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

      <div class="text-center mt-4">
        <a routerLink="/properties" class="btn btn-outline-primary btn-lg">View All Properties</a>
      </div>
    </div>
  `,
    styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 0;
      margin-bottom: 2rem;
    }
    .search-box {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .property-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .property-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    .property-card img {
      height: 200px;
      object-fit: cover;
    }
    .property-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 0.75rem;
      font-weight: bold;
      color: white;
    }
    .badge-sale { background-color: #28a745; }
    .badge-rent { background-color: #ffc107; }
    .property-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
    }
    .property-features {
      display: flex;
      gap: 15px;
      font-size: 0.9rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProperties: Property[] = [];
  isLoadingFeatured = false;
  isSearching = false;
  searchCriteria: any = {};
  placeholderImage = environment.placeholderImage;

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.loadFeaturedProperties();
  }

  loadFeaturedProperties(): void {
    this.isLoadingFeatured = true;
    this.propertyService.getFeaturedProperties().subscribe({
      next: (response: any) => {
        this.isLoadingFeatured = false;
        if (response.success) {
          this.featuredProperties = response.data;
        }
      },
      error: () => this.isLoadingFeatured = false
    });
  }

  onSearch(): void {
    const params = new URLSearchParams();
    if (this.searchCriteria.keyword) params.set('keyword', this.searchCriteria.keyword);
    if (this.searchCriteria.listingType) params.set('listingType', this.searchCriteria.listingType);
    if (this.searchCriteria.propertyType) params.set('propertyType', this.searchCriteria.propertyType);
    if (this.searchCriteria.minPrice) params.set('minPrice', this.searchCriteria.minPrice);
    if (this.searchCriteria.maxPrice) params.set('maxPrice', this.searchCriteria.maxPrice);
    window.location.href = '/search?' + params.toString();
  }
}
