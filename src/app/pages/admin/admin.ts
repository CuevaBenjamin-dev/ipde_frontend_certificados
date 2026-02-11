import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService, UsuarioAdmin } from '../../services/admin-service';
import { DownloadEventRow, EventsAdminService } from '../../services/events-admin-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

// @Component({
//   selector: 'app-admin',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './admin.html',
//   styleUrl: './admin.css',
// })
// export class AdminComponent implements OnInit {
//   usuarios: UsuarioAdmin[] = [];
//   form: FormGroup;
//   cargando = false;

//   constructor(
//     private adminService: AdminService,
//     private fb: FormBuilder,
//   ) {
//     this.form = this.fb.group({
//       usuario: ['', [Validators.required, Validators.minLength(5)]],
//       password: ['', [Validators.required, Validators.minLength(8)]],
//       role: ['USER', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     this.cargarUsuarios();
//   }

//   cargarUsuarios(): void {
//     this.cargando = true;

//     this.adminService.listarUsuarios().subscribe({
//       next: (res) => {
//         if (res.success && res.data) {
//           this.usuarios = res.data;
//         }
//         this.cargando = false;
//       },
//       error: () => {
//         alert('Error al cargar usuarios');
//         this.cargando = false;
//       },
//     });
//   }

//   crearUsuario(): void {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     this.adminService.crearUsuario(this.form.value).subscribe({
//       next: () => {
//         this.form.reset({ role: 'USER' });
//         this.cargarUsuarios();
//       },
//       error: (err) => {
//         alert(err.error?.message ?? 'Error al crear usuario');
//       },
//     });
//   }

//   eliminarUsuario(id: number): void {
//     if (!confirm('¿Eliminar este usuario?')) return;

//     this.adminService.eliminarUsuario(id).subscribe({
//       next: () => this.cargarUsuarios(),
//       error: () => alert('No se pudo eliminar el usuario'),
//     });
//   }
// }

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit {
  usuarios: UsuarioAdmin[] = [];
  form: FormGroup;
  cargando = false;

  // ✅ descargas
  usuarioSeleccionado: UsuarioAdmin | null = null;
  descargas: DownloadEventRow[] = [];
  cargandoDescargas = false;

  // filtros (YYYY-MM-DD)
  fromDate: string = '';
  toDate: string = '';

  constructor(
    private adminService: AdminService,
    private eventsAdminService: EventsAdminService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['USER', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;

    this.adminService.listarUsuarios().subscribe({
      next: (res) => {
        if (res.success && res.data) this.usuarios = res.data;
        this.cargando = false;
      },
      error: () => {
        alert('Error al cargar usuarios');
        this.cargando = false;
      },
    });
  }

  crearUsuario(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.adminService.crearUsuario(this.form.value).subscribe({
      next: () => {
        this.form.reset({ role: 'USER' });
        this.cargarUsuarios();
      },
      error: (err) => alert(err.error?.message ?? 'Error al crear usuario'),
    });
  }

  eliminarUsuario(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;

    this.adminService.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert('No se pudo eliminar el usuario'),
    });
  }

  // ==========================
  // ✅ TABLA DE DESCARGAS
  // ==========================
  abrirTablaDescargas(u: UsuarioAdmin): void {
    this.usuarioSeleccionado = u;

    // por defecto (si quieres): hoy -> hoy
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');

    this.fromDate = `${yyyy}-${mm}-${dd}`;
    this.toDate = `${yyyy}-${mm}-${dd}`;

    this.cargarDescargas();
  }

  cerrarTablaDescargas(): void {
    this.usuarioSeleccionado = null;
    this.descargas = [];
    this.fromDate = '';
    this.toDate = '';
  }

  cargarDescargas(): void {
    if (!this.usuarioSeleccionado) return;

    this.cargandoDescargas = true;

    this.eventsAdminService
      .getDownloads(this.usuarioSeleccionado.usuario, this.fromDate, this.toDate)
      .subscribe({
        next: (res) => {
          this.descargas = res.success && res.data ? res.data : [];
          this.cargandoDescargas = false;
        },
        error: () => {
          alert('No se pudo cargar la tabla de descargas');
          this.cargandoDescargas = false;
        },
      });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/login']);
      },
    });
  }
}
