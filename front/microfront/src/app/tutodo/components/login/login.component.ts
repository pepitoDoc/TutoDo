import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { InsertUserRequest, LoginUserRequest } from '../../model/data';
import { FormBuilder, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';
import { switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tutodo-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm = this._nnfb.group({
    email: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.maxLength(256)]]
  });

  registerForm = this._nnfb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.maxLength(256)]]
  });

  inputState: boolean = true;
  loginResult: boolean = false;
  hidePassword: boolean = true;
  loginMessage!: string;

  constructor(
    private readonly _apiService: ApiService,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _toast: ToastrService
  ) { }

  ngOnInit(): void {

  }

  login(): void {
    const data: LoginUserRequest = { ...this.loginForm.getRawValue() };
    this._apiService.loginUser$(data).subscribe({
      next: (response) => {
        if (response === 'login_succesful' || response === 'already_logged') {
          this._toast.success('Se ha iniciado sesión correctamente');
          this._router.navigate([`../${TutodoRoutes.TUTODO}`], { relativeTo: this._route });
          this.loginResult = false;
        } else {
          this.loginResult = true;
          this.loginMessage = 'Las credenciales introducidas no son correctas';
          this._toast.warning('Las credenciales introducidas no son válidas.', 'Credenciales incorrectas');
        }
      },
      error: (err) => {
        this.loginMessage = 'Error del servidor al iniciar sesión';
        this._toast.error('Error del servidor al iniciar sesión.', 'Error del servidor');
        console.log(err);
      }
    });
  }

  register(): void {
    const data: InsertUserRequest = { ...this.registerForm.getRawValue() };
    this._apiService.insertUser$(data).subscribe({
      next: (response) => {
        if (response === 'user_registered') {
          this._toast.success('Se ha iniciado sesión correctamente');
          this._router.navigate([`../${TutodoRoutes.TUTODO}`], { relativeTo: this._route });
          this.loginResult = false;
        } else {
          this.loginResult = true;
          this._toast.warning('Ya existe un usuario con ese nombre o correo electrónico.', 'Credenciales no disponibles');
          this.loginMessage = 'Ya existe un usuario con ese nombre o correo electrónico';
        }
      },
      error: (err) => {
        this.loginMessage = 'Error del servidor al registrar el usuario';
        this._toast.error('Error del servidor al iniciar sesión.', 'Error del servidor');
        console.log(err);
      }
    });
  }

  changeInputState(): void {
    this.inputState = !this.inputState;
  }

}
