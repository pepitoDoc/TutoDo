import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { TutodoRoutes } from '../tutodo.routes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const checkSession = this.authService.canActivate();
    if (checkSession) {
      return true;
    } else {
      return this.router.parseUrl(TutodoRoutes.LOGIN);
    }
  }

}
