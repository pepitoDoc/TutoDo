import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GuardResult, MaybeAsync, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environment/environment';
import { switchMap, of, catchError, Observable, shareReplay } from 'rxjs';
import { TutodoRoutes } from '../../tutodo.routes';

@Injectable({
  providedIn: 'root'
})
export class ConfirmedService {

  private readonly _endpoint = environment.ENDPOINT;
  private readonly _userEndpoint = `${this._endpoint}/user`;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router,
    private readonly _toast: ToastrService
  ) { }

  canActivate(): Observable<MaybeAsync<GuardResult>> {
    return this._findUserIsValid$().pipe(
      switchMap(response => {
        if (response === 'user_confirmed') {
          return of(this._router.parseUrl(TutodoRoutes.HOME));
        } else if (response === 'user_not_confirmed') {
          return of(true);
        } else {
          if (response === 'session_expired') {
            this._toast.error('Debe tener una sesión activa.', 'Sesión no detectada');
          } else if (response === 'user_not_found') {
            this._toast.error('No ha sido posible encontrar su usuario; por favor, inicie sesión de nuevo', 'Usuario no encontrado');
          } else {
            this._toast.error('Error desconocido; por favor, inicie sesión de nuevo', 'Error desconocido');
          }
          return of(this._router.parseUrl(TutodoRoutes.LOGIN));
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          this._toast.error('Debe tener una sesión activa.', 'Sesión no detectada');
          return of(this._router.parseUrl(TutodoRoutes.LOGIN));
        } else {
          this._toast.error('El servidor no se encuentra disponible.', 'Error del servidor');
          return of(this._router.parseUrl(TutodoRoutes.LOGIN));
        }
      })
    );
  }

  private _findUserIsValid$(): Observable<string> {
    return this._http.get(`${this._userEndpoint}/check-valid`,
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

}
