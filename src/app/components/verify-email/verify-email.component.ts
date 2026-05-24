import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-verify-email',
    imports: [CommonModule],
    template: `
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow text-center">
            <div class="card-body p-5">
              <div *ngIf="loading" class="py-5">
                <div class="spinner-border text-primary mb-3" role="status"></div>
                <p>Verifying your email...</p>
              </div>

              <div *ngIf="success" class="py-5">
                <div class="text-success mb-3" style="font-size: 4rem;">✓</div>
                <h3>Email Verified!</h3>
                <p class="text-muted">Your email has been successfully verified. You can now post properties.</p>
                <a routerLink="/login" class="btn btn-primary">Go to Login</a>
              </div>

              <div *ngIf="error" class="py-5">
                <div class="text-danger mb-3" style="font-size: 4rem;">✗</div>
                <h3>Verification Failed</h3>
                <p class="text-muted">{{errorMessage}}</p>
                <a routerLink="/register" class="btn btn-primary">Register Again</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  success = false;
  error = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response.success) {
            this.success = true;
          } else {
            this.error = true;
            this.errorMessage = response.message || 'Verification failed';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = err.error?.message || 'Invalid or expired token';
        }
      });
    } else {
      this.loading = false;
      this.error = true;
      this.errorMessage = 'No verification token provided';
    }
  }
}
