import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-property-detail',
    imports: [CommonModule],
    template: `
    <div class="container my-5" *ngIf="property">
      <div class="row">
        <div class="col-lg-8">
          <img [src]="property.imageUrl || placeholderImageLarge" class="img-fluid rounded mb-4 w-100" style="height: 400px; object-fit: cover;">

          <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="mb-0">{{property.title}}</h1>
            <span class="badge" [ngClass]="property.listingType === 'SALE' ? 'bg-primary' : 'bg-success'" style="font-size: 1.2rem;">
              {{ property.listingType === 'SALE' ? 'FOR SALE' : 'FOR RENT' }}
            </span>
          </div>

          <p class="property-price mb-4">\${{property.price | number}}</p>

          <div class="property-features mb-4 p-3 bg-light rounded">
            <span class="feature fs-5 me-4">🛏️ {{property.bedrooms}} Bedrooms</span>
            <span class="feature fs-5 me-4">🛁 {{property.bathrooms}} Bathrooms</span>
            <span class="feature fs-5">📐 {{property.squareFeet | number}} sqft</span>
          </div>

          <h3 class="mb-3">Description</h3>
          <p class="text-muted">{{property.description}}</p>

          <h3 class="mt-4 mb-3">Location</h3>
          <p class="text-muted">{{property.address}}, {{property.city}}, {{property.state}} {{property.zipCode}}</p>

          <div class="mt-4" *ngIf="property.owner">
            <h4>Contact Agent</h4>
            <div class="card">
              <div class="card-body">
                <p class="mb-1"><strong>{{property.owner.firstName}} {{property.owner.lastName}}</strong></p>
                <p class="mb-1">Phone: {{property.owner.phone}}</p>
                <p class="mb-0">Email: {{property.owner.email}}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title mb-3">Property Details</h4>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between">
                  <span>Type:</span>
                  <strong>{{property.type}}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Bedrooms:</span>
                  <strong>{{property.bedrooms}}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Bathrooms:</span>
                  <strong>{{property.bathrooms}}</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Size:</span>
                  <strong>{{property.squareFeet | number}} sqft</strong>
                </li>
                <li class="list-group-item d-flex justify-content-between">
                  <span>Status:</span>
                  <strong class="text-success">Active</strong>
                </li>
              </ul>
            </div>
          </div>

          <div class="card mt-3" *ngIf="canEdit">
            <div class="card-body">
              <h4 class="card-title mb-3">Manage Property</h4>
              <button class="btn btn-primary w-100 mb-2" (click)="editProperty()">Edit</button>
              <button class="btn btn-danger w-100" (click)="deleteProperty()">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PropertyDetailComponent implements OnInit {
  property: any = null;
  canEdit = false;
  currentUserId: number | null = null;
  placeholderImageLarge = environment.placeholderImageLarge;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.propertyService.getPropertyById(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.property = response.data;
          this.checkCanEdit();
        }
      }
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id;
      this.checkCanEdit();
    });
  }

  checkCanEdit(): void {
    this.canEdit = this.currentUserId === this.property?.owner?.id;
  }

  editProperty(): void {
    this.router.navigate(['/create-property'], { queryParams: { edit: this.property.id } });
  }

  deleteProperty(): void {
    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(this.property.id).subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Property deleted successfully');
            this.router.navigate(['/my-properties']);
          }
        },
        error: () => alert('Error deleting property')
      });
    }
  }
}
