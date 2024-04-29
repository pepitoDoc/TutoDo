import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { InsertUserRequest, LoginUserRequest } from '../model/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private endpoint = environment.endpoint;

  public loginUser$(data: LoginUserRequest): Observable<string> {
    return this.http.post(`${this.endpoint}/user/login`, data, {withCredentials: true, responseType: 'text'});
  }

  public insertUser$(data: InsertUserRequest): Observable<string> {
    return this.http.post(`${this.endpoint}/user/insert`, data, {withCredentials: true, responseType: 'text'});
  }

  public checkSession$(): Observable<string> {
    return this.http.get(`${this.endpoint}/user/checkSession`, {withCredentials: true, responseType: 'text'});
  }

}
