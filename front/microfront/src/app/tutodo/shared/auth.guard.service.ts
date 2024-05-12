import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { TutodoRoutes } from '../tutodo.routes';
import { ApiService } from '../service/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router
  ) { }

  canActivate(): Observable<MaybeAsync<GuardResult>> {
    return this._authService.canActivate();
  }

}
