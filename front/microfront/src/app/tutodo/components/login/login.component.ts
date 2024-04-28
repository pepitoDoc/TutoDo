import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { UserLoginRequest } from '../../model/data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {

  }

}
