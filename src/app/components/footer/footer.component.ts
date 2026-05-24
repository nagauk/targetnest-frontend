import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    imports: [RouterModule],
    template: `
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <h5>🏠 RealEstate Platform</h5>
            <p>Your trusted partner for buying, selling, and renting properties.</p>
          </div>
          <div class="col-md-4">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><a routerLink="/" class="text-white-50">Home</a></li>
              <li><a routerLink="/properties/for-sale" class="text-white-50">Properties for Sale</a></li>
              <li><a routerLink="/properties/for-rent" class="text-white-50">Properties for Rent</a></li>
              <li><a routerLink="/search" class="text-white-50">Search Properties</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Contact</h5>
            <p class="text-white-50">
              Email: info&#64;realestate.com<br>
              Phone: (555) 123-4567
            </p>
          </div>
        </div>
        <hr class="my-4" style="border-color: rgba(255,255,255,0.2)">
        <div class="text-center text-white-50">
          <p>&copy; 2024 RealEstate Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer {
      background-color: #2c3e50;
      color: white;
      padding: 3rem 0 1rem;
      margin-top: auto;
    }
    .footer h5 {
      margin-bottom: 1rem;
      font-weight: 600;
    }
    .footer a {
      text-decoration: none;
      transition: opacity 0.3s ease;
    }
    .footer a:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  `]
})
export class FooterComponent { }
