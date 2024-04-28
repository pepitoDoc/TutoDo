import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { UserLoginRequest } from '../model/data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private endpoint = environment.endpoint;

  public userLogin$(data: UserLoginRequest): Observable<string> {
    return this.http.post(`${this.endpoint}/user/login`, data, {withCredentials: true, responseType: 'text'});
  }

}
