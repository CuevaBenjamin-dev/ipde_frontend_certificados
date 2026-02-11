import { Routes } from '@angular/router';
import { Formulario } from './pages/formulario/formulario';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './pages/admin/admin';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'generar-diploma',
    component: Formulario,
    canActivate: [authGuard], // 🔐 PROTEGIDO
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard], // 🔐 DOBLE FILTRO
  },
  {
    path: '**',
    redirectTo: 'generar-diploma',
  },
];
