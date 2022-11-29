import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {      
        if (this.isLoggedIn()) {      
            return true;      
        }      

        // navigate to login page as user is not authenticated   
        sessionStorage.clear();   
        this.router.navigate(['/sign-in']);      
        return false;      
    }      

    public isLoggedIn(): boolean {      
        let status = false;      
        if (sessionStorage.getItem('isLoggedIn') == "true") {      
            status = true;      
        }
        else {      
            status = false;      
        }      

        return status;      
    }    
}