import { CanActivateFn } from '@angular/router';

export const librarianGuard: CanActivateFn = (route, state) => {
  return true;
};
