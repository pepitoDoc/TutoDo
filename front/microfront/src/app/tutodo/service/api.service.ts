import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { InsertUserRequest, LoginUserRequest } from '../model/data';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private endpoint = environment.ENDPOINT;
  private userEndpoint = `${this.endpoint}/user`;
  private guideTypeEndpoint = `${this.endpoint}/guideType`;

  loginUser$(data: LoginUserRequest): Observable<string> {
    return this.http.post<string>(`${this.userEndpoint}/login`, data, {withCredentials: true});
  }

  public insertUser$(data: InsertUserRequest): Observable<string> {
    return this.http.post<string>(`${this.userEndpoint}/insert`, data, {withCredentials: true});
  }

  public checkSession$(): Observable<string> {
    return this.http.get<string>(`${this.userEndpoint}/checkSession`, {withCredentials: true});
  }

  public getAllGuideTypes$(): Observable<string[]> {
    return this.http.get< { guideTypes: string[] }>(`${this.guideTypeEndpoint}/findAll`).pipe(
      map( response => response.guideTypes)
    );
  }

}
