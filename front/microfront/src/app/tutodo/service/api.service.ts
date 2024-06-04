import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { AddRatingRequest, CreateGuideRequest, DeleteGuideStepRequest, FindByFilterRequest, FindByFilterResponse, Guide, InsertUserRequest, LoginUserRequest, AddCommentRequest, SaveGuideInfoRequest, SaveGuideStepsRequest, AddCommentResponse, DeleteCommentRequest } from '../model/data';
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
    return this._http.post(`${this._userEndpoint}/create`, insertUserRequest, 
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  checkSession$(): Observable<string> { // POR AHORA NO LO USA
    return this._http.get(`${this._userEndpoint}/check-session`, 
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  findAllUserInfo$(): Observable<UserData> { // POR AHORA NO LO USO
    return this._http.get<UserData>(`${this._userEndpoint}/find-all-user-info`, 
      { withCredentials: true }).pipe(shareReplay(1));
  }

  findAllGuideTypes$(): Observable<string[]> {
    return this._http.get<string[]>(`${this._guideTypeEndpoint}/findAll`, 
      { withCredentials: true }).pipe(shareReplay(1));
  }

  createGuide$(createGuideRequest: FormData): Observable<string> {
    return this._http.post(`${this._guideEndpoint}/create`, createGuideRequest, 
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  deleteGuide$(guideId: string): Observable<string> {
    return this._http.delete(`${this._guideEndpoint}/delete/${guideId}`, 
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  saveGuideStep$(saveGuideStepRequest: FormData): Observable<string> {
    return this._http.patch(`${this._guideEndpoint}/save-step`, saveGuideStepRequest, 
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  deleteGuideStep$(deleteGuideStepRequest: DeleteGuideStepRequest): Observable<string> {
    return this._http.patch(`${this._guideEndpoint}/delete-step`, deleteGuideStepRequest, 
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  saveGuideInfo$(saveGuideInfoRequest: FormData): Observable<string> {
    return this._http.patch(`${this._guideEndpoint}/save-info`, saveGuideInfoRequest, 
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  findGuideById$(guideId: string): Observable<Guide> {
    return this._http.get<Guide>(`${this._guideEndpoint}/find-by-id/${guideId}`, { withCredentials: true }).pipe(
        map(guide => this._formatGuideDates(guide)),
        shareReplay(1));
  }

  findGuideIsPublished$(guideId: string): Observable<boolean> { // POR AHGORA NO LO USO
    return this._http.get<boolean>(`${this._guideEndpoint}/find-published-by-id`, 
      { params: new HttpParams().set('guideId', guideId), withCredentials: true }).pipe(shareReplay(1));
  }

  findGuideByFilter$(findByFilterRequest: FindByFilterRequest): Observable<FindByFilterResponse[]> {
    return this._http.post<FindByFilterResponse[]>(`${this._guideEndpoint}/find-by-filter`, findByFilterRequest,
      { withCredentials: true }).pipe(shareReplay(1));
  }

  findOwnGuides$(): Observable<Guide[]> {
    return this._http.get<Guide[]>(`${this._guideEndpoint}/find-own-guides`, 
      { withCredentials: true }).pipe(shareReplay(1));
  }

  submitRating$(addRatingRequest: AddRatingRequest): Observable<string> {
    return this._http.patch(`${this._guideEndpoint}/add-rating`, addRatingRequest, 
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  submitComment$(addCommentRequest: AddCommentRequest): Observable<AddCommentResponse> {
    return this._http.patch<AddCommentResponse>(`${this._guideEndpoint}/add-comment`, addCommentRequest,
      { withCredentials: true }).pipe(
        map(response => { return { ...response, comment: 
          { ...response.comment, formattedDate: new Date(response.comment.date) } } }),
        shareReplay(1));
  }

  deleteComment$(deleteCommentRequest: DeleteCommentRequest): Observable<string> {
    return this._http.patch(`${this._guideEndpoint}/delete-comment`, deleteCommentRequest,
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  logout$(): Observable<any> {
    return this._http.post(`${this._userEndpoint}/logout`, {}, { withCredentials: true }).pipe(shareReplay(1));
  }

  addSaved$(guideId: string): Observable<string> {
    return this._http.patch(`${this._guideEndpoint}/add-saved/${guideId}`, {},
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  deleteSaved$(guideId: string): Observable<string> {
    return this._http.patch(`${this._guideEndpoint}/delete-saved/${guideId}`, {},
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  private _formatGuideDates(guide: Guide): Guide {
    guide.creationDate = new Date(guide.creationDate);
    guide.comments = guide.comments.map(comment =>  { return { ...comment, formattedDate: new Date(comment.date) } });
    return guide;
  }

}
