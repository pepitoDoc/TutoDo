import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { CreateGuideRequest, FindByFilterRequest, Guide, InsertUserRequest, LoginUserRequest, SaveGuideInfoRequest, SaveGuideStepsRequest, UploadImage } from '../model/data';
import { Observable, map, share, shareReplay } from 'rxjs';
import { UserData } from '../model/user-data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  private readonly _endpoint = environment.ENDPOINT;
  private readonly _userEndpoint = `${this._endpoint}/user`;
  private readonly _guideTypeEndpoint = `${this._endpoint}/guideType`;
  private readonly _guideEndpoint = `${this._endpoint}/guide`;

  loginUser$(loginUserRequest: LoginUserRequest): Observable<string> {
    return this._http.post(`${this._userEndpoint}/login`, loginUserRequest, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  insertUser$(insertUserRequest: InsertUserRequest): Observable<string> {
    return this._http.post(`${this._userEndpoint}/insert`, insertUserRequest, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  checkSession$(): Observable<string> {
    return this._http.get(`${this._userEndpoint}/check-session`, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  findAllUserInfo$(): Observable<UserData> {
    return this._http.get<UserData>(`${this._userEndpoint}/find-all-user-info`, { withCredentials: true }).pipe(shareReplay(1));
  }

  findAllGuideTypes$(): Observable<string[]> {
    return this._http.get<{ guideTypes: string[] }>(`${this._guideTypeEndpoint}/findAll`, { withCredentials: true }).pipe(
      map(response => response.guideTypes),
      shareReplay(1)
    );
  }

  createGuide$(createGuideRequest: FormData): Observable<string> {
    return this._http.post(`${this._guideEndpoint}/create`, createGuideRequest, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  saveGuideSteps$(saveGuideStepsRequest: SaveGuideStepsRequest): Observable<string> {
    return this._http.post(`${this._guideEndpoint}/save-steps`, saveGuideStepsRequest, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  saveGuideInfo$(saveGuideInfoRequest: SaveGuideInfoRequest): Observable<string> {
    return this._http.post(`${this._guideEndpoint}/save-info`, saveGuideInfoRequest, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  findGuideById$(guideId: string): Observable<Guide> {
    return this._http.get<Guide>(`${this._guideEndpoint}/find-by-id`, { params: new HttpParams().set('guideId', guideId) }).pipe(shareReplay(1));
  }

  findGuideIsPublished$(guideId: string): Observable<boolean> {
    return this._http.get<boolean>(`${this._guideEndpoint}/find-published-by-id`, { params: new HttpParams().set('guideId', guideId) }).pipe(shareReplay(1));
  }

  findGuideByFilter$(findByFilterRequest: FindByFilterRequest): Observable<Guide[]> {
    return this._http.post<Guide[]>(`${this._guideEndpoint}/find-by-filter`, findByFilterRequest).pipe(shareReplay(1));
  }

  findOwnGuides$(): Observable<Guide[]> {
    return this._http.get<Guide[]>(`${this._guideEndpoint}/find-own-guides`, { withCredentials: true }).pipe(shareReplay(1));
  }

  uploadImage$(formData: FormData): Observable<any> {
    return this._http.post(`${this._guideEndpoint}/upload-image`, formData).pipe(shareReplay(1));
  }

}
