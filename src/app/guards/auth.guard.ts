import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles = this.authService.currentUserValue?.roles.map((r) => r.name) || [];
      const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRequiredRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
}
