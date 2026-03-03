import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
  take(1),
  map(user => {
    if (user) {
      return true;
    }

    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  })
);

};


/**
 Using take(1) ensures: 

 You only check the current authentication state once

 The subscription automatically completes

 No memory leaks

 The guard doesn’t keep listening for future chagnes
 */