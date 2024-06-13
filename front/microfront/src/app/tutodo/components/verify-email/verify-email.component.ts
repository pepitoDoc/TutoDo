import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { TutodoRoutes } from '../../tutodo.routes';

@Component({
  selector: 'tutodo-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {

  verificationCode!: string;
  codeChecked = false;
  codeSent = false;
  verifyMessage = '';

  verificationInfo = this._nnfb.group({
    code: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
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
    this._sharedService.getPersistedData$('verification').subscribe({
      next: (response) => {
        if (typeof response === 'object' && Object.keys(response).length !== 0 && response.verification) {
          this.verificationCode = response.verificationCode;
          this.codeSent = true;
          this._toast.info('Ya existe un proceso de verificación en curso; por favor, ' +
            'compruebe su correo para obtener el código, o seleccione "Reenviar código" para obtener un código nuevo',
            'Proceso de verificación en curso.');
        }
        this.codeChecked = true;
      }
    });
  }

  sendCode(): void {
    this._apiService.sendCode$('verification').subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._toast.success('Por favor, comprueba la bandeja de su correo electrónico ' 
            + 'para obtener el código de verificación.',
            'Código de verificación enviado');
          this.codeSent = true;
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.LOGIN}`]);
      }
    });
  }

  verifyCode(): void {
    this._apiService.verifyCode$('verification', this.verificationInfo.controls.code.value).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._apiService.updateConfirmed$(true).subscribe({
            next: (response) => {
              if (response === 'operation_successful') {
                this._toast.success('Se ha verificado su cuenta correctamente.', 'Cuenta verificada');
                this._router.navigate([`../${TutodoRoutes.TUTODO}`], { relativeTo: this._route });
              } else {
                this._toast.error('Error en la operación', 'Error del servidor');
              }
            },
            error: (error) => {
              this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
              this._router.navigate([`/${TutodoRoutes.LOGIN}`]);
            }
          });
        } else {
          this._toast.warning('El código introducido no es válido', 'Código no válido');
          this.verifyMessage = 'El código introducido no es válido';
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.LOGIN}`]);
      }
    });
  }

}
