import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            
            if ([401, 403 , 502].indexOf(err.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api

                this.authService.logout();
            }

            const error = err.error.message || err.statusText;
            Swal.fire({
                title: err.status,
                text: err.statusText,
                icon: 'error',
                confirmButtonText: 'OK',
            }).then(
                () => {
                    console.log(err);
                }
            );
            return throwError(error);
        }))
    }
}