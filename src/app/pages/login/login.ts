import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      usuario: [''],
      password: [''],
    });
    // ✅ SI YA ESTÁ LOGEADO → NO PUEDE VER LOGIN
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/generar-diploma']);
      return;
    }
  }

  onSubmit(): void {
    const request = {
      usuario: this.form.value.usuario,
      password: this.form.value.password,
    };

    this.authService.login(request).subscribe({
      next: (res) => {
        /**
         * LOGIN - NIVEL 7
         *
         * - AccessToken → se guarda (temporalmente) en localStorage
         * - RefreshToken → lo maneja el navegador vía cookie HttpOnly
         */
        if (res.success && res.data) {
          localStorage.setItem('accessToken', res.data.accessToken);

          // ❌ Ya NO guardamos refresh token
          // localStorage.removeItem('refreshToken');

          alert('Login exitoso');
          this.router.navigate(['/generar-diploma']);
        }
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
  }
}
