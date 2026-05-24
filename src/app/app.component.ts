import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
    styles: [],
    standalone: false
})
export class AppComponent {
  title = 'Real Estate Platform';
}
