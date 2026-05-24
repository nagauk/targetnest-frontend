import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

interface SearchCriteria {
  keyword: string;
  listingType: string;
  propertyType: string;
  minPrice: number | null;
  maxPrice: number | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
}

interface Property {
  id: number;
  title: string;
  price: number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  listingType: 'SALE' | 'RENT';
  imageUrl: string;
}

interface SearchResponse {
  success: boolean;
  data: {
    content: Property[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
}

@Component({
    selector: 'app-search-properties',
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="container my-5">
      <h2 class="mb-4">Search Properties</h2>

      <!-- Search Form -->
      <div class="card mb-4 shadow-sm">
        <div class="card-body">
          <form (submit)="onSearch(); $event.preventDefault()">
            <div class="row g-3">
              <div class="col-md-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Keyword..."
                  [(ngModel)]="searchCriteria.keyword"
                  name="keyword"
                  aria-label="Search keyword">
              </div>
              <div class="col-md-2">
                <select
                  class="form-select"
                  [(ngModel)]="searchCriteria.listingType"
                  name="listingType"
                  aria-label="Listing type">
                  <option value="">All Types</option>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </div>
              <div class="col-md-2">
                <select
                  class="form-select"
                  [(ngModel)]="searchCriteria.propertyType"
                  name="propertyType"
                  aria-label="Property type">
                  <option value="">Any Type</option>
                  <option value="HOUSE">House</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="CONDO">Condo</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
              <div class="col-md-2">
                <input
                  type="number"
                  class="form-control"
                  placeholder="Min Price"
                  [(ngModel)]="searchCriteria.minPrice"
                  name="minPrice"
                  aria-label="Minimum price">
              </div>
              <div class="col-md-2">
                <input
                  type="number"
                  class="form-control"
                  placeholder="Max Price"
                  [(ngModel)]="searchCriteria.maxPrice"
                  name="maxPrice"
                  aria-label="Maximum price">
              </div>
              <div class="col-md-1">
                <button type="submit" class="btn btn-primary w-100" [disabled]="isLoading">
                  <span *ngIf="!isLoading">Search</span>
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm" role="status"></span>
                </button>
              </div>
            </div>
            <div class="row g-3 mt-2">
              <div class="col-md-2">
                <input
                  type="number"
                  class="form-control"
                  placeholder="Min Beds"
                  [(ngModel)]="searchCriteria.minBedrooms"
                  name="minBedrooms"
                  aria-label="Minimum bedrooms">
              </div>
              <div class="col-md-2">
                <input
                  type="number"
                  class="form-control"
                  placeholder="Min Baths"
                  [(ngModel)]="searchCriteria.minBathrooms"
                  name="minBathrooms"
                  aria-label="Minimum bathrooms">
              </div>
              <div class="col-md-8 text-end">
                <button type="button" class="btn btn-outline-secondary" (click)="resetFilters()">
                  Reset Filters
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading properties...</span>
        </div>
        <p class="mt-3 text-muted">Searching for properties...</p>
      </div>

      <!-- No Results -->
      <div *ngIf="!isLoading && properties.length === 0" class="text-center py-5">
        <i class="bi bi-house-x" style="font-size: 4rem; color: #ccc;"></i>
        <p class="text-muted fs-5 mt-3">No properties found. Try adjusting your search criteria.</p>
        <button class="btn btn-outline-primary" (click)="resetFilters()">Clear All Filters</button>
      </div>

      <!-- Results -->
      <div class="row g-4" *ngIf="properties.length > 0">
        <div class="col-md-4" *ngFor="let property of properties">
          <div class="card property-card h-100">
            <img
              [src]="property.imageUrl || 'assets/images/placeholder.jpg'"
              class="card-img-top"
              [alt]="property.title"
              (error)="handleImageError($event)">
            <span class="property-badge" [class.badge-sale]="property.listingType === 'SALE'" [class.badge-rent]="property.listingType === 'RENT'">
              {{ property.listingType === 'SALE' ? 'FOR SALE' : 'FOR RENT' }}
            </span>
            <div class="card-body">
              <h5 class="card-title">{{property.title}}</h5>
              <p class="property-price">{{ formatPrice(property.price) }}</p>
              <p class="card-text text-muted">
                <i class="bi bi-geo-alt"></i> {{property.city}}, {{property.state}}
              </p>
              <div class="property-features">
                <span class="feature">🛏️ {{property.bedrooms}} Beds</span>
                <span class="feature">🛁 {{property.bathrooms}} Baths</span>
                <span class="feature">📐 {{ formatNumber(property.squareFeet) }} sqft</span>
              </div>
            </div>
            <div class="card-footer bg-white border-0">
              <a [routerLink]="['/properties', property.id]" class="btn btn-primary w-100">View Details</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-4" *ngIf="totalPages > 1">
        <button
          class="btn btn-outline-primary"
          (click)="previousPage()"
          [disabled]="currentPage === 0 || isLoading">
          <i class="bi bi-chevron-left"></i> Previous
        </button>
        <span class="text-muted">
          Page {{currentPage + 1}} of {{totalPages}}
          <span class="mx-2">•</span>
          {{totalElements}} properties found
        </span>
        <button
          class="btn btn-outline-primary"
          (click)="nextPage()"
          [disabled]="currentPage >= totalPages - 1 || isLoading">
          Next <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .property-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
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
      z-index: 1;
    }
    .badge-sale {
      background-color: #28a745;
    }
    .badge-rent {
      background-color: #ffc107;
      color: #000;
    }
    .property-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
      margin: 10px 0;
    }
    .property-features {
      display: flex;
      gap: 15px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .feature {
      font-size: 0.875rem;
      color: #6c757d;
    }
    @media (max-width: 768px) {
      .property-features {
        gap: 10px;
      }
      .feature {
        font-size: 0.75rem;
      }
    }
  `]
})
export class SearchPropertiesComponent implements OnInit, OnDestroy {
  properties: Property[] = [];
  isLoading = false;
  currentPage = 0;
  totalPages = 1;
  totalElements = 0;
  pageSize = 12;

  searchCriteria: SearchCriteria = {
    keyword: '',
    listingType: '',
    propertyType: '',
    minPrice: null,
    maxPrice: null,
    minBedrooms: null,
    minBathrooms: null
  };

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) { }

  ngOnInit(): void {
    this.initializeSearchFromQueryParams();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeSearchFromQueryParams(): void {
    const params = this.route.snapshot.queryParams;

    this.searchCriteria.keyword = params['keyword'] || '';
    this.searchCriteria.listingType = params['listingType'] || '';
    this.searchCriteria.propertyType = params['propertyType'] || '';
    this.searchCriteria.minPrice = params['minPrice'] ? +params['minPrice'] : null;
    this.searchCriteria.maxPrice = params['maxPrice'] ? +params['maxPrice'] : null;
    this.searchCriteria.minBedrooms = params['minBedrooms'] ? +params['minBedrooms'] : null;
    this.searchCriteria.minBathrooms = params['minBathrooms'] ? +params['minBathrooms'] : null;
    this.currentPage = params['page'] ? +params['page'] : 0;

    const hasSearchCriteria = Object.values(this.searchCriteria).some(value =>
      value !== null && value !== '' && value !== 0
    );

    if (hasSearchCriteria || this.currentPage > 0) {
      this.performSearch();
    }
  }

  onSearch(): void {
    this.currentPage = 0;
    this.updateUrlParams();
    this.performSearch();
  }

  private updateUrlParams(): void {
    const params: any = {};

    Object.entries(this.searchCriteria).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== 0) {
        params[key] = value.toString();
      }
    });

    params['page'] = this.currentPage.toString();
    params['size'] = this.pageSize.toString();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private performSearch(): void {
    this.isLoading = true;

    const searchParams = {
      ...this.searchCriteria,
      page: this.currentPage,
      size: this.pageSize
    };

    const sub = this.propertyService.searchProperties(searchParams).subscribe({
      next: (response: SearchResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.properties = response.data.content;
          this.totalPages = response.data.totalPages;
          this.totalElements = response.data.totalElements;
        } else {
          this.handleError('Failed to load properties');
        }
      },
      error: (error) => {
        this.handleError(error.message || 'An error occurred while searching');
        this.isLoading = false;
        this.properties = [];
      }
    });

    this.subscriptions.add(sub);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1 && !this.isLoading) {
      this.currentPage++;
      this.updateUrlParams();
      this.performSearch();
      this.scrollToTop();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0 && !this.isLoading) {
      this.currentPage--;
      this.updateUrlParams();
      this.performSearch();
      this.scrollToTop();
    }
  }

  resetFilters(): void {
    this.searchCriteria = {
      keyword: '',
      listingType: '',
      propertyType: '',
      minPrice: null,
      maxPrice: null,
      minBedrooms: null,
      minBathrooms: null
    };
    this.currentPage = 0;
    this.onSearch();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private handleError(message: string): void {
    console.error('Search error:', message);
    // You can add toast/notification service here
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.jpg';
  }
}