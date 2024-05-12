import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { UserData } from '../model/user-data';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _endpoint = environment.ENDPOINT;
  private readonly _userEndpoint = `${this._endpoint}/user`;
  private readonly _userData$: Observable<UserData>;

  constructor(
    private readonly _httpClient: HttpClient
  ) {
    this._userData$ = this._httpClient.get<UserData>(`${this._userEndpoint}/get-user`, { withCredentials: true }).pipe(shareReplay(1));
   }

   getUserData$(): Observable<UserData> {
    return this._userData$;
   }
}
