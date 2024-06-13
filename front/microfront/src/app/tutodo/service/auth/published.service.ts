import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GuardResult, MaybeAsync, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of, shareReplay, switchMap } from 'rxjs';
import { TutodoRoutes } from '../../tutodo.routes';

@Injectable({
  providedIn: 'root'
})
export class PublishedService {

  private readonly _endpoint = environment.ENDPOINT;
  private readonly _guideEndpoint = `${this._endpoint}/guide`;

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router,
    private readonly _toast: ToastrService
  ) { }

  canActivate(guideId: string): MaybeAsync<GuardResult> {
    return this._findGuideIsPublished$(guideId).pipe(
      switchMap(response => {
        if (response) {
          return of(true);
        } else {
          this._toast.error('La guía introducida no se encuentra disponible, no existe o no se encuentra publicada.', 'Guía no encontrada');
          return of(this._router.parseUrl(TutodoRoutes.HOME));
        }
      }),
      catchError(() => {
        this._toast.error('El servidor no se encuentra disponible.', 'Error del servidor');
        return of(this._router.parseUrl(TutodoRoutes.LOGIN));
      })
    );
  }

  private _findGuideIsPublished$(guideId: string): Observable<boolean> {
    return this._http.get<boolean>(`${this._guideEndpoint}/get-published-permission`, 
      { params: new HttpParams().set('guideId', guideId), withCredentials: true }).pipe(shareReplay(1));
  }

}