import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, Route, Router, RouterStateSnapshot } from '@angular/router';
import { TutodoRoutes } from '../tutodo.routes';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  constructor(
    private readonly apiService: ApiService
  ) { }

  canActivate(): boolean {
    let checkResponse: string = '';
    this.apiService.checkSession$().pipe(
      tap( response => checkResponse = response)
    ).subscribe();
    if (checkResponse === 'session_confirmed') {
      return true;
    } else {
      return false;
    }
  }
}