import { Injectable } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private readonly _spinner: SpinnerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.context.get(SkipLoading)) {
      return next.handle(req);
    }
    this._spinner.loadingOn();
    return next.handle(req).pipe(
      finalize(() => {
        this._spinner.loadingOff();
      })
    );
  }

}
