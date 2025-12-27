import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importando o Router
import { LoginService } from 'src/app/services/login/login.service'; // Importando o serviço de login

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null; // Variável para armazenar a mensagem de erro

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginError = null; // Limpa a mensagem de erro antes de tentar o login
    this.isLoading = true;
    const loginData = this.loginForm.value;

    this.loginService.postLogin(loginData).subscribe(
      (response) => {
        if (response && response.token && response.refreshToken) {
          this.loginService.storeTokens({
            token: response.token,
            refreshToken: response.refreshToken,
            idUsuario: response.idUsuario
          });

          this.isLoading = false;
          this.router.navigate(['/home']);
        } else {
          this.loginError = 'E-mail ou senha inválidos.'; // Mensagem para erro inesperado
          this.isLoading = false;
        }
      },
      (error) => {
        this.loginError = 'E-mail ou senha inválidos.'; // Mensagem de erro genérica
        this.isLoading = false;
      }
    );
  }
}
