import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-create-property',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="mb-4">{{editMode ? 'Edit Property' : 'Post New Property'}}</h2>

              <div *ngIf="!user?.emailVerified" class="alert alert-warning">
                <strong>Email Not Verified!</strong> Please verify your email to post properties.
                <button class="btn btn-sm btn-outline-primary ms-2" (click)="resendVerification()">Resend Verification</button>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
              <div *ngIf="successMessage" class="alert alert-success">{{successMessage}}</div>

              <form [formGroup]="propertyForm" (ngSubmit)="onSubmit()" *ngIf="user?.emailVerified">
                <div class="mb-3">
                  <label class="form-label">Title</label>
                  <input type="text" class="form-control" formControlName="title" placeholder="e.g., Beautiful 3BR House in Downtown">
                </div>

                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" formControlName="description" rows="4" placeholder="Describe your property..."></textarea>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Price ($)</label>
                    <input type="number" class="form-control" formControlName="price">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Listing Type</label>
                    <select class="form-select" formControlName="listingType">
                      <option value="SALE">For Sale</option>
                      <option value="RENT">For Rent</option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Property Type</label>
                    <select class="form-select" formControlName="type">
                      <option value="HOUSE">House</option>
                      <option value="APARTMENT">Apartment</option>
                      <option value="CONDO">Condo</option>
                      <option value="TOWNHOUSE">Townhouse</option>
                      <option value="LAND">Land</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Image URL</label>
                    <input type="text" class="form-control" formControlName="imageUrl" placeholder="https://...">
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Address</label>
                  <input type="text" class="form-control" formControlName="address">
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">City</label>
                    <input type="text" class="form-control" formControlName="city">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">State</label>
                    <input type="text" class="form-control" formControlName="state">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Zip Code</label>
                    <input type="text" class="form-control" formControlName="zipCode">
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Bedrooms</label>
                    <input type="number" class="form-control" formControlName="bedrooms">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Bathrooms</label>
                    <input type="number" class="form-control" formControlName="bathrooms">
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Square Feet</label>
                    <input type="number" class="form-control" formControlName="squareFeet">
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" formControlName="featured" id="featured">
                  <label class="form-check-label" for="featured">Featured Property</label>
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="propertyForm.invalid || loading">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  {{loading ? (editMode ? 'Updating...' : 'Posting...') : (editMode ? 'Update Property' : 'Post Property')}}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CreatePropertyComponent implements OnInit {
  propertyForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  editMode = false;
  propertyId: number | null = null;
  user: any = null;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      listingType: ['SALE', Validators.required],
      type: ['HOUSE', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      bedrooms: ['', [Validators.required, Validators.min(0)]],
      bathrooms: ['', [Validators.required, Validators.min(0)]],
      squareFeet: ['', [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      featured: [false]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

    this.propertyId = this.route.snapshot.queryParams['edit'];
    if (this.propertyId) {
      this.editMode = true;
      this.loadProperty();
    }
  }

  loadProperty(): void {
    this.propertyService.getPropertyById(this.propertyId!).subscribe({
      next: (response: any) => {
        if (response.success) {
          const p = response.data;
          this.propertyForm.patchValue({
            title: p.title,
            description: p.description,
            price: p.price,
            listingType: p.listingType,
            type: p.type,
            address: p.address,
            city: p.city,
            state: p.state,
            zipCode: p.zipCode,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            squareFeet: p.squareFeet,
            imageUrl: p.imageUrl,
            featured: p.featured
          });
        }
      }
    });
  }

  resendVerification(): void {
    if (this.user?.email) {
      this.authService.resendVerification(this.user.email).subscribe({
        next: () => alert('Verification email sent'),
        error: () => alert('Failed to resend verification')
      });
    }
  }

  onSubmit(): void {
    if (this.propertyForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const request = this.editMode
        ? this.propertyService.updateProperty(this.propertyId!, this.propertyForm.value)
        : this.propertyService.createProperty(this.propertyForm.value);

      request.subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.message || (this.editMode ? 'Property updated!' : 'Property posted successfully!');
            setTimeout(() => {
              this.router.navigate(['/my-properties']);
            }, 1500);
          } else {
            this.errorMessage = response.message || 'Failed to save property';
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Failed to save property';
        }
      });
    }
  }
}
