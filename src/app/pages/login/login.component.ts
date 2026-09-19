import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/login/login.service';
import { GuilhocheComponent } from 'src/app/shared/guilhoche/guilhoche.component';
import { IconComponent } from 'src/app/shared/icon/icon.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, GuilhocheComponent, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  loginError = signal<string | null>(null);
  isLoading = signal(false);
  mostrarSenha = signal(false);

  get email() { return this.loginForm.controls.email; }
  get senha() { return this.loginForm.controls.senha; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginError.set(null);
    this.isLoading.set(true);

    this.loginService.postLogin(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response?.token && response?.refreshToken) {
          this.router.navigate(['/home']);
        } else {
          this.loginError.set('E-mail ou senha inválidos.');
        }
      },
      error: (erro: unknown) => {
        this.isLoading.set(false);
        const semConexao = erro instanceof HttpErrorResponse && (erro.status === 0 || erro.status >= 500);
        this.loginError.set(semConexao
          ? 'Não foi possível falar com o servidor. Tente de novo em instantes.'
          : 'E-mail ou senha inválidos.');
      }
    });
  }
}
