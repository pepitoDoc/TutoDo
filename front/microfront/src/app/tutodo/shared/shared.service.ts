import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, shareReplay } from 'rxjs';
import { environment } from '../environment/environment';
import { SharedData } from '../model/data';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private readonly _http: HttpClient
  ) {}

  private readonly _sharedEndpoint: string = `${environment.ENDPOINT}/shared`;
  private readonly _dataSubject: ReplaySubject<Object> = new ReplaySubject<Object>();

  setData(persistedData: Object): void {
    this._setPersistedData$(persistedData).subscribe();
    this._dataSubject.next(persistedData);
  }

  getData$(): Observable<Object> {
    return this._dataSubject.asObservable();
  }

  getPersistedData$(...data: string[]): Observable<any> {
    return this._http.post(`${this._sharedEndpoint}/get-data`, data, { withCredentials: true }).pipe(shareReplay(1));
  }

  private _setPersistedData$(data: Object): Observable<any> {
    return this._http.post(`${this._sharedEndpoint}/post-data`, data, { withCredentials: true }).pipe(shareReplay(1));
  }

}
