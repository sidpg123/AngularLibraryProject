import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((errorResponse) => {

            if (errorResponse.status === 401 || errorResponse.status === 403) {
                localStorage.removeItem('auth_token');
                router.navigate(['/auth/login']);
            }

            if (errorResponse.status === 0 || errorResponse.status === 500) {
                errorResponse.error = {
                    ...errorResponse.error,
                    error: "Server unavailable, please try again later"
                };
            }

            return throwError(() => errorResponse);
        })
    );
};