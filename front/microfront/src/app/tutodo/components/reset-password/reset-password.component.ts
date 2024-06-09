import { Component } from '@angular/core';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { TutodoRoutes } from '../../tutodo.routes';

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

  verificationInfo = this._nnfb.group({
    code: ['', [Validators.required, Validators.maxLength(8)]]
  });

  passwordReset = this._nnfb.group({
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
    this._sharedService.getPersistedData$('password').subscribe({
      next: (response) => {
        if (typeof response === 'object' && Object.keys(response).length !== 0 && response.verification) {
          this.verificationCode = response.verificationCode;
          this.codeSent = true;
          this._toast.info(); // TODO
        }
        this.codeChecked = true;
      },
      error: (error) => {
        // TODO
      }
    })
  }

  sendCode(): void {
    this._apiService.sendCode$('password').subscribe({
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
          
          
        } else {
          this._toast.error() // TODO
        }
      },
      error: (error) => {
        // TODO
      }
    });
  }

}
