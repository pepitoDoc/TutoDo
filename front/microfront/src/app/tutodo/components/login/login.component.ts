import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { InsertUserRequest, LoginUserRequest } from '../../model/data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';
import { switchMap } from 'rxjs';

@Component({
  selector: 'tutodo-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    userIdentifier: ['', Validators.required],
    password: ['', Validators.required]
  });

  registerForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.maxLength(256)]]
  });

  inputState: boolean = true;
  loginResult: boolean = false;
  hidePassword: boolean = true;
  loginMessage!: string;

  constructor(
    private readonly apiService: ApiService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {

  }

  login(): void {
    const data: LoginUserRequest = { ...this.loginForm.value };
    this.apiService.loginUser$(data).subscribe({
      next: (response) => {
        if (response === 'login_succesful' || response === 'already_logged') {
          this.router.navigate([`../${TutodoRoutes.HOME}`], { relativeTo: this.route });
          this.loginResult = false;
        } else {
          this.loginResult = true;
          this.loginMessage = 'Las credenciales introducidas no son correctas';
        }
      },
      error: (err) => {
        this.loginMessage = 'Error del servidor al iniciar sesión';
        console.log(err);
      }
    });
  }

  register(): void {
    const data: InsertUserRequest = { ...this.registerForm.value };
    this.apiService.insertUser$(data).subscribe({
      next: (response) => {
        if (response === 'user_registered') {
          this.router.navigate([`../${TutodoRoutes.HOME}`], { relativeTo: this.route });
          this.loginResult = false;
        } else {
          this.loginResult = true;
          this.loginMessage = 'Ya existe un usuario con ese nombre o correo electrónico';
        }
      },
      error: (err) => {
        this.loginMessage = 'Error del servidor al registrar el usuario';
        console.log(err);
      }
    });
  }

  changeInputState(): void {
    this.inputState = !this.inputState;
  }

}
