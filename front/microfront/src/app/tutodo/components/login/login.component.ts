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
    password: ['', [Validators.required, Validators.maxLength(256)]],
    passwordConfirm: ['', [Validators.required, Validators.maxLength(256)]],
  });

  inputState = true;
  hidePassword = true;
  loginMessage = '';
  registerMessage = '';

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
          this.loginMessage = '';
        } else {
          this.loginMessage = 'Las credenciales introducidas no son correctas';
          this.loginMessage = '';
          this._toast.warning('Las credenciales introducidas no son válidas.', 'Credenciales incorrectas');
        }
      },
      error: (error) => {
        this.loginMessage = 'Error del servidor al iniciar sesión';
        this._toast.error('Error del servidor al iniciar sesión.', 'Error del servidor');
      }
    });
  }

  register(): void {
    const data: InsertUserRequest = { ...this.registerForm.getRawValue() };
    if (this.registerForm.controls.password.getRawValue()
      === this.registerForm.controls.passwordConfirm.getRawValue()) {
      this._apiService.insertUser$(data).subscribe({
        next: (response) => {
          if (response === 'operation_successful') {
            this._toast.success('Se ha creado el usuario correctamente', 'Usuario creado');
            this.loginMessage = '';
            this.changeInputState();
          } else {
            if (response === 'username_takenemail_taken') {
              this._toast.warning('El correo electrónico y nombre de usuario introducido ya existen.', 'Credenciales no disponibles');
              this.loginMessage = 'El correo electrónico y nombre de usuario introducido ya existen.';
            } else if (response === 'username_taken') {
              this._toast.warning('El nombre de usuario introducido ya existe.', 'Credenciales no disponibles');
              this.loginMessage = 'El nombre de usuario introducido ya existe.';
            } else if (response === 'email_taken') {
              this._toast.warning('El correo electrónico introducido ya existe.', 'Credenciales no disponibles');
              this.loginMessage = 'El correo electrónico introducido ya existe.';
            } else {
              this._toast.warning('Ha habido un error en el proceso de creación de usuario.', 'Error en el registro');
              this.loginMessage = 'Ha habido un error en el proceso de creación de usuario; por favor, inténtelo de nuevo.';
            }
          }
        },
        error: (err) => {
          this.loginMessage = 'Error del servidor al registrar el usuario';
          this._toast.error('Error del servidor al iniciar sesión.', 'Error del servidor');
        }
      });
    } else {
      this.loginMessage = 'Las contraseñas introducidas no coinciden';
      this._toast.warning('Las contraseñas introducidas no coinciden.', 'Credenciales no válidas');
    }
  }

  changeInputState(): void {
    this.inputState = !this.inputState;
  }

}
