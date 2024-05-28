
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Injectable } from '@angular/core';
import { Router, MaybeAsync, GuardResult } from '@angular/router';
import { tap, Observable, shareReplay, switchMap, of, catchError } from 'rxjs';
import { TutodoRoutes } from '../tutodo.routes';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _endpoint = environment.ENDPOINT;
  private readonly _userEndpoint = `${this._endpoint}/user`;
  //private isAuthenticated = false;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router,
    private readonly _toast: ToastrService
  ) {
    // this.checkSession$().subscribe({
    //   next: (response) => {
    //     this.isAuthenticated = response === 'session_confirmed';
    //   },
    //   error: (error) => {

    //   }
    // });
  }

  canActivate(): Observable<MaybeAsync<GuardResult>> {
    return this.checkSession$().pipe(
      switchMap(response => {
        if (response === 'session_confirmed') {
          return of(true);
        } else {
          this._toast.error('Su sesión ha caducado tras cierto tiempo de inactividad.', 'Sesión caducada');
          return of(this._router.parseUrl(TutodoRoutes.LOGIN));
        }
      }),
      catchError(() => {
        this._toast.error('El servidor no se encuentra disponible.', 'Error del servidor')
        return of(this._router.parseUrl(TutodoRoutes.LOGIN));
      })
    );
  }

  canActivateChild(): Observable<MaybeAsync<GuardResult>> {
    return this.checkSession$().pipe(
      switchMap(response => {
        if (response === 'session_confirmed') {
          return of(true);
        } else {
          this._toast.error('Su sesión ha caducado tras cierto tiempo de inactividad.', 'Sesión caducada');
          return of(this._router.parseUrl(TutodoRoutes.LOGIN));
        }
      }),
      catchError(() => {
        this._toast.error('El servidor no se encuentra disponible.', 'Error del servidor');
        return of(this._router.parseUrl(TutodoRoutes.LOGIN));
      })
    );
  }

  checkSession$(): Observable<string> {
    return this._http.get(`${this._userEndpoint}/check-session`, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }
}