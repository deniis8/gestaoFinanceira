import { Router, NavigationEnd } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;  // Acesso ao mat-sidenav

  // Método para alternar o estado da sidebar
  toggleSidebar() {
    this.sidenav.toggle();
  }

  // Método chamado ao selecionar uma opção no menu
  selectOption() {
    this.sidenav.close();  // Fecha a sidebar ao selecionar uma opção
  }

  title = 'gestaoFinanceira';
  showHeaderFooter = true; // Define se o header e footer devem ser exibidos

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showHeaderFooter = event.url !== '/login'; // Atualiza com base na URL
      }
    });
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  selectSair(): void {
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('idUsuario');
  }
}
