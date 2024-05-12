
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Injectable } from '@angular/core';
import { Router, MaybeAsync, GuardResult } from '@angular/router';
import { tap, Observable, shareReplay, switchMap, of } from 'rxjs';
import { TutodoRoutes } from '../tutodo.routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _endpoint = environment.ENDPOINT;
  private readonly _userEndpoint = `${this._endpoint}/user`;
  private isAuthenticated = false;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) { 
    this.checkSession$().pipe(
      tap(response => this.isAuthenticated = response === 'session_confirmed')
    ).subscribe();
  }

  canActivate(): Observable<MaybeAsync<GuardResult>> {
    return this.checkSession$().pipe(
      switchMap(response => {
        return response === 'session_confirmed' ? of(true) : of(this._router.parseUrl(TutodoRoutes.LOGIN));
      })
    );
  }

  canActivateChild(): Observable<MaybeAsync<GuardResult>> {
    return this.checkSession$().pipe(
      switchMap(response => {
        return response === 'session_confirmed' ? of(true) : of(this._router.parseUrl(TutodoRoutes.LOGIN));
      })
    );
  }

  checkSession$(): Observable<string> {
    return this._http.get(`${this._userEndpoint}/check-session`, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }
}