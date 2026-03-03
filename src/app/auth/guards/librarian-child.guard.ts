import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const librarianGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getIsLibrarian()) {
    return true;
  }

  return router.createUrlTree(['/books'])
};
