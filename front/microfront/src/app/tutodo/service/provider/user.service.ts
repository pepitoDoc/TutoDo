import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { UserBasicInfo, UserData } from '../../model/user-data';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _endpoint = environment.ENDPOINT;
  private readonly _userEndpoint = `${this._endpoint}/user`;

  constructor(
    private readonly _httpClient: HttpClient
  ) { }

  getUserData$(): Observable<UserData> {
    return this._httpClient.get<UserData>(`${this._userEndpoint}/get-user`, { withCredentials: true }).pipe(shareReplay(1));
  }

  getUserBasicInfo$(): Observable<UserBasicInfo> {
    return this._httpClient.get<UserBasicInfo>(`${this._userEndpoint}/get-user-basic`, { withCredentials: true }).pipe(shareReplay(1));
  }

}
