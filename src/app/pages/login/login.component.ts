import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importando o Router
import { LoginService } from 'src/app/services/login.service'; // Importando o serviço de login

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router // Injetando o Router
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

    const loginData = this.loginForm.value;

    this.loginService.postLogin(loginData).subscribe(
      (response) => {
        if (response && response.token && response.refreshToken) {
          // Armazenando os tokens
          this.loginService.storeTokens({
            token: response.token,
            refreshToken: response.refreshToken
          });

          // Redirecionando para a página inicial (home)
          this.router.navigate(['/home']); // Redireciona para a rota "home"
        } else {
          console.error('Erro ao autenticar');
        }
      },
      (error) => {
        console.error('Erro na requisição de login', error);
      }
    );
  }
}
