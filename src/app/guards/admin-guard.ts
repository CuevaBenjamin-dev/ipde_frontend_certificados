import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

/**
 * ADMIN GUARD
 *
 * - Evita que usuarios USER entren al panel admin
 * - Esto es SOLO UX
 * - El backend sigue siendo la fuente de verdad
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getRole();

  if (role === 'ADMIN') {
    return true;
  }

  // ❌ No autorizado
  router.navigate(['/generar-diploma']);
  return false;
};
