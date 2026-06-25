import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/** Usage: canActivate: [authGuard, roleGuard('DOCTOR')] */
export function roleGuard(allowedRole: UserRole): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.role() === allowedRole) {
      return true;
    }

    // Logged in as the wrong role — send them to their own dashboard rather than login.
    const fallback = authService.role() === 'DOCTOR' ? '/doctor' : '/patient';
    router.navigate([fallback]);
    return false;
  };
}
