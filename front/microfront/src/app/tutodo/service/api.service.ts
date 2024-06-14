import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import {
  AddRatingRequest, DeleteGuideStepRequest, FindByFilterRequest,
  FindByFilterResponse, LoginUserRequest,
  AddCommentRequest, AddCommentResponse, DeleteCommentRequest,
  ChangePasswordByEmailRequest,
  GuidePaginationResponse,
  UserPaginationResponse,
  GuideInfo,
  GuideVisualizeInfo,
  GuideModifySteps,
  GuideModifyInfo,
  InsertUserRequest,
  ChangePasswordByIdRequest
} from '../model/data';
import { Observable, map, shareReplay } from 'rxjs';
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

  findGuideByIdVisualize$(guideId: string): Observable<GuideVisualizeInfo> {
    return this._http.get<GuideVisualizeInfo>(`${this._guideEndpoint}/find-by-id-visualize/${guideId}`, { withCredentials: true }).pipe(
      map(guide => { return { ...guide, comments: guide.comments.map(comment => { return { ...comment, formattedDate: new Date(comment.date) } }) } }),
      shareReplay(1));
  }

  findGuideByIdSteps$(guideId: string): Observable<GuideModifySteps> {
    return this._http.get<GuideModifySteps>(`${this._guideEndpoint}/find-by-id-steps/${guideId}`, { withCredentials: true }).pipe(shareReplay(1));
  }

  findGuideByIdInfo$(guideId: string): Observable<GuideModifyInfo> {
    return this._http.get<GuideModifyInfo>(`${this._guideEndpoint}/find-by-id-info/${guideId}`, { withCredentials: true }).pipe(shareReplay(1));
  }

  findGuideByFilter$(findByFilterRequest: FindByFilterRequest): Observable<FindByFilterResponse> {
    return this._http.post<FindByFilterResponse>(`${this._guideEndpoint}/find-by-filter`, findByFilterRequest,
      { withCredentials: true }).pipe(shareReplay(1));
  }

  findOwnGuides$(pageNumber?: number): Observable<GuidePaginationResponse> {
    if (pageNumber) {
      return this._http.get<GuidePaginationResponse>(`${this._guideEndpoint}/find-own-guides`,
        { withCredentials: true, params: new HttpParams().append('pageNumber', pageNumber) }).pipe(shareReplay(1));
    } else {
      return this._http.get<GuidePaginationResponse>(`${this._guideEndpoint}/find-own-guides`,
        { withCredentials: true }).pipe(shareReplay(1));
    }
  }

  findSaved$(pageNumber?: number): Observable<GuidePaginationResponse> {
    if (pageNumber) {
      return this._http.get<GuidePaginationResponse>(`${this._guideEndpoint}/find-saved`,
        { withCredentials: true, params: new HttpParams().append('pageNumber', pageNumber) }).pipe(shareReplay(1));
    } else {
      return this._http.get<GuidePaginationResponse>(`${this._guideEndpoint}/find-saved`,
        { withCredentials: true }).pipe(shareReplay(1));
    }
  }

  submitRating$(addRatingRequest: AddRatingRequest): Observable<string> {
    return this._http.patch(`${this._guideEndpoint}/add-rating`, addRatingRequest,
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  submitComment$(addCommentRequest: AddCommentRequest): Observable<AddCommentResponse> {
    return this._http.patch<AddCommentResponse>(`${this._guideEndpoint}/add-comment`, addCommentRequest,
      { withCredentials: true }).pipe(
        map(response => {
          return {
            ...response, comment:
              { ...response.comment, formattedDate: new Date(response.comment.date) }
          }
        }),
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
    return this._http.patch(`${this._userEndpoint}/add-saved/${guideId}`, {},
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  deleteSaved$(guideId: string): Observable<string> {
    return this._http.patch(`${this._userEndpoint}/remove-saved/${guideId}`, {},
      { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  findNewestGuides$(): Observable<GuideInfo[]> {
    return this._http.get<GuideInfo[]>(`${this._guideEndpoint}/find-newest`, { withCredentials: true }).pipe(shareReplay(1));
  }

  findNewestGuidesByPreference$(preference: string): Observable<GuideInfo[]> {
    return this._http.get<GuideInfo[]>(`${this._guideEndpoint}/find-newest-by-preference`,
      { withCredentials: true, params: new HttpParams().append('preference', preference) }).pipe(shareReplay(1));
  }

  sendCode$(codeType: string, email?: string): Observable<string> {
    return this._http.post(`${this._userEndpoint}/send-code/${codeType}`,
      { email: email ? email : '' }, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  verifyCode$(codeType: string, codeValue: string): Observable<string> {
    return this._http.get(`${this._userEndpoint}/verify-code/${codeType}`, {
      withCredentials: true, responseType: 'text',
      params: new HttpParams().append('codeValue', codeValue)
    }).pipe(shareReplay(1));
  }

  updateConfirmed$(confirmed: boolean): Observable<string> {
    return this._http.patch(`${this._userEndpoint}/update-confirmed/${confirmed}`, {}, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  changePasswordByEmail$(payload: ChangePasswordByEmailRequest): Observable<string> {
    return this._http.patch(`${this._userEndpoint}/change-password-by-email`, payload, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  changePasswordById$(payload: ChangePasswordByIdRequest): Observable<string> {
    return this._http.patch(`${this._userEndpoint}/change-password-by-id`, payload, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  findUsers$(username: string, pageNumber?: number): Observable<UserPaginationResponse> {
    if (pageNumber) {
      return this._http.get<UserPaginationResponse>(`${this._userEndpoint}/find-users/${username}`,
        { withCredentials: true, params: new HttpParams().append('pageNumber', pageNumber) }).pipe(shareReplay(1));
    } else {
      return this._http.get<UserPaginationResponse>(`${this._userEndpoint}/find-users/${username}`, { withCredentials: true }).pipe(shareReplay(1));
    }
  }

  addCompleted$(guideId: string): Observable<string> {
    return this._http.patch(`${this._userEndpoint}/add-completed/${guideId}`, {}, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  changeUsername$(username: string): Observable<string> {
    return this._http.patch(`${this._userEndpoint}/change-username/${username}`, {}, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  changeEmail$(email: string): Observable<string> {
    return this._http.patch(`${this._userEndpoint}/change-email`, { email: email }, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

  changePreferences$(preferences: string[]): Observable<string> {
    return this._http.patch(`${this._userEndpoint}/change-preferences`, { guideTypes: preferences }, { withCredentials: true, responseType: 'text' }).pipe(shareReplay(1));
  }

}
