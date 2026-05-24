import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">Create Account</h2>

              <div *ngIf="errorMessage" class="alert alert-danger">
                {{errorMessage}}
              </div>
              <div *ngIf="successMessage" class="alert alert-success">
                {{successMessage}}
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" formControlName="firstName" [class.is-invalid]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                    <div class="invalid-feedback">First name is required</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" formControlName="lastName" [class.is-invalid]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                    <div class="invalid-feedback">Last name is required</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" formControlName="email" [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                  <div class="invalid-feedback" *ngIf="registerForm.get('email')?.errors?.['email']">Valid email is required</div>
                  <div class="invalid-feedback" *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-control" formControlName="phone" [class.is-invalid]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched">
                  <div class="invalid-feedback">Phone number is required</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" formControlName="password" [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                  <div class="invalid-feedback">Password must be at least 6 characters</div>
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="registerForm.invalid || loading">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  {{loading ? 'Creating Account...' : 'Register'}}
                </button>
              </form>

              <p class="text-center mt-4 mb-0">
                Already have an account? <a routerLink="/login">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.data?.message || 'Registration successful! Please check your email to verify your account.';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}
