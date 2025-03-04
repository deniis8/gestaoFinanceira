import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'gestaoFinanceira';
  showHeaderFooter = true; // Define se o header e footer devem ser exibidos

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeaderFooter = event.url !== '/login'; // Atualiza com base na URL
      }
    });
  }
}
