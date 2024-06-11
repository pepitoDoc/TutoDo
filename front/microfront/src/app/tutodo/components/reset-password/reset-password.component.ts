import { Component } from '@angular/core';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { TutodoRoutes } from '../../tutodo.routes';
import { ChangePasswordRequest } from '../../model/data';

@Component({
  selector: 'tutodo-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  verificationCode!: string;
  codeChecked = false;
  codeSent = false;
  codeConfirmed = false;
  hidePassword = true;
  hidePasswordConfirm = true;
  resetMessage = '';

  emailInfo = this._nnfb.group({
    email: ['', [Validators.required, Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]]
  });

  verificationInfo = this._nnfb.group({
    code: ['', [Validators.required, Validators.maxLength(8)]]
  });

  passwordInfo = this._nnfb.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256)]]
  });

  constructor(
    private readonly _apiService: ApiService,
    private readonly _sharedService: SharedService,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _toast: ToastrService
  ) { }

  ngOnInit(): void {

  }

  sendCode(): void {
    this._apiService.sendCode$('password', this.emailInfo.controls.email.value).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._toast.success('Por favor, comprueba la bandeja de su correo electrónico '
            + 'para obtener el código de verificación.',
            'Código de verificación enviado');
          this.codeSent = true;
        } else {
          this._toast.error() // TODO
        }
      },
      error: (error) => {
        // TODO
      }
    });
  }

  verifyCode(): void {
    this._apiService.verifyCode$('password', this.verificationInfo.controls.code.value).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this.codeConfirmed = true;
          this._toast.success('Puede introducir la nueva contraseña', 'Código confirmado');
        } else {
          this._toast.error() // TODO
        }
      },
      error: (error) => {
        // TODO
      }
    });
  }

  resetPassword(): void {
    if (this.passwordInfo.controls.passwordConfirm.value === this.passwordInfo.controls.password.value) {
      const payload: ChangePasswordRequest = {
        email: this.emailInfo.controls.email.value,
        newPassword: this.passwordInfo.controls.passwordConfirm.value
      }
      this._apiService.changePasswordByEmail$(payload).subscribe({
        next: (response) => {
          if (response === 'operation_successful') {
            this._toast.success('Ahora puede iniciar sesión con sus nuevas credenciales', 'Contraseña actualizada correctamente');
            this._router.navigate([`../`], { relativeTo: this._route });
          }
        },
        error: (error) => {

        }
      });
    } else {
      this.resetMessage = 'Las contraseñas introducidas no coinciden';
      this._toast.warning('Las contraseñas introducidas no coinciden');
    }
  }

}
