import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { UserBasicInfo } from '../../model/user-data';
import { UserService } from '../../service/provider/user.service';
import { ApiService } from '../../service/api.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ChangePasswordByIdRequest } from '../../model/data';
import { Observable, map } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';

@Component({
  selector: 'tutodo-user-modify-info',
  templateUrl: './user-modify-info.component.html',
  styleUrl: './user-modify-info.component.scss'
})
export class UserModifyInfoComponent implements OnInit{

  userData!: UserBasicInfo;
  chosenTypes!: string[];
  guideTypes!: string[];
  filteredTypes!: Observable<string[]>;
  announcer = inject(LiveAnnouncer);
  readonly separatorKeysCodesTypes = [] as const;
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  dataModifying = [false, false, false, false];
  dataIndex = -1;
  showModify = false;
  hidePassword = [true, true, true];
  modifyMessage = '';

  constructor(
    private readonly _service: ApiService,
    private readonly _user: UserService,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _toast: ToastrService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute
  ) {}

  usernameInfo = this._nnfb.group({
    username: ['', [Validators.required, Validators.maxLength(100)]]
  });

  passwordInfo = this._nnfb.group({
    oldPassword: ['', [Validators.required, Validators.maxLength(256)]],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]],
    newPasswordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256)]]
  });

  emailInfo = this._nnfb.group({
    email: ['', [Validators.required, Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]]
  });

  preferencesInfo = this._nnfb.group({
    guideTypes: ['']
  });

  ngOnInit(): void {
    this._user.getUserBasicInfo$().subscribe({
      next: (response) => {
        this.userData = response;
        this.chosenTypes = this.userData.preferences;
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`../${TutodoRoutes.TUTODO}`], { relativeTo: this._route });
      }
    });
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes =
          this.preferencesInfo.controls.guideTypes.valueChanges.pipe(
            map((guideType: string) =>
              guideType !== ''
                ? this._filter(guideType)
                : this.guideTypes.slice()
            )
          );
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`../${TutodoRoutes.TUTODO}`], { relativeTo: this._route });
      }
    });
  }

  listToString(list: string[]): string {
    if (list.length > 0) {
      let formattedList = '';
      list.forEach(string => formattedList = formattedList + `${string}, `);
      return formattedList.substring(0, formattedList.length - 2);
    }
    return '';
  }

  modifyInfo(infoType: number): void {
    this.dataModifying[infoType] = true;
    this.showModify = true;
    this.dataIndex = infoType;
  }

  showInfo(): void {
    this.dataModifying[this.dataIndex] = false;
    this.showModify = false;
    this.dataIndex = -1;
    this.modifyMessage = '';
  }

  changeUsername(): void {
    if (this.usernameInfo.controls.username.value !== this.userData.username) {
      this._service.changeUsername$(this.usernameInfo.controls.username.value).subscribe({
        next: (response) => {
          if (response === 'operation_successful') {
            this._toast.success('Información cambiada exitósamente');
            this.modifyMessage = '';
            window.location.reload();
          } else if (response === 'username_taken') {
            this._toast.warning('El nombre de usuario introducido está siendo ya utilizado', 'Nombre no válido');
            this.modifyMessage = 'El nombre de usuario introducido está siendo ya utilizado';
          } else {
            this._toast.error('Error en la operación', 'Error del servidor');
            this.modifyMessage = 'Error en la operación';
          }
        },
        error: (error) => {
          this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
          this._router.navigate([`../${TutodoRoutes.TUTODO}`], { relativeTo: this._route });
        }
      });
    } else {
      this._toast.warning('El nombre de usuario introducido es el mismo que está usando', 'Nombre no válido');
      this.modifyMessage = 'El nombre de usuario introducido es el mismo que está usando';
    }
  }

  changeEmail(): void {
    if (this.emailInfo.controls.email.value !== this.userData.email) {
      this._service.changeEmail$(this.emailInfo.controls.email.value).subscribe({
        next: (response) => {
          if (response === 'operation_successful') {
            this._toast.success('Información cambiada exitósamente');
            this.modifyMessage = '';
            window.location.reload();
          } else if (response === 'email_taken') {
            this._toast.warning('El correo electrónico introducido está siendo ya utilizado', 'Correo electrónico no válido');
            this.modifyMessage = 'El correo electrónico introducido está siendo ya utilizado';
          } else {
            this._toast.error('Error en la operación', 'Error del servidor');
            this.modifyMessage = 'Error en la operación';
          }
        },
        error: (error) => {
          this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
          this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
        }
      });
    } else {
      this._toast.warning('El correo electrónico introducido es el mismo que está usando', 'Correo electrónico no válido');
      this.modifyMessage = 'El correo electrónico introducido es el mismo que está usando';
    }
  }

  changePassword(): void {
    if (this.passwordInfo.controls.newPassword.value === this.passwordInfo.controls.newPasswordConfirm.value) {
      const payload: ChangePasswordByIdRequest = { 
        oldPassword: this.passwordInfo.controls.oldPassword.value,
        newPassword: this.passwordInfo.controls.newPassword.value
      };
      this._service.changePasswordById$(payload).subscribe({
        next: (response) => {
          if (response === 'operation_successful') {
            this._toast.success('Información cambiada exitósamente');
            this.passwordInfo.reset();
            this.showInfo();
            this.modifyMessage = '';
          } else if (response === 'password_incorrect') {
            this._toast.warning('Su contraseña actual no coinciden con la introducida', 'Contraseña no válida');
            this.modifyMessage = 'Su contraseña actual no coinciden con la introducida';
          } else {

          }
        },
        error: (error) => {
          this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
          this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
        }
      });
    } else {
      this._toast.warning('La nueva contraseña introducida no coincide con la introducida en "Confirmar contraseña"', 'Contraseña no válida');
      this.modifyMessage = 'La nueva contraseña introducida no coincide con la introducida en "Confirmar contraseña"';
    }
  }

  changePreferences(): void {
    this._service.changePreferences$(this.chosenTypes).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._toast.success('Información cambiada exitósamente');
          this.modifyMessage = '';
          window.location.reload();
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
          this.modifyMessage = 'Error en la operación';
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`../${TutodoRoutes.TUTODO}`], { relativeTo: this._route });
      }
    })
  }

  removeType(guideType: string): void {
    const index = this.chosenTypes.indexOf(guideType);
    if (index >= 0) {
      this.chosenTypes.splice(index, 1);
      this.announcer.announce(`Removed ${guideType}`);
    }
    if (this.chosenTypes.length === 4) {
      this.preferencesInfo.controls.guideTypes.enable();
      this.guideTypeInput.nativeElement.disabled = false;
    }
    this.preferencesInfo.controls.guideTypes.reset();
  }

  selectedType(event: MatAutocompleteSelectedEvent): void {
    this.chosenTypes.push(event.option.viewValue);
    if (this.chosenTypes.length === 5) {
      this.preferencesInfo.controls.guideTypes.disable();
      this.guideTypeInput.nativeElement.disabled = true;
    }
    this.guideTypeInput.nativeElement.value = '';
    this.preferencesInfo.controls.guideTypes.reset();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter((guideType) =>
      guideType.toLowerCase().includes(filterValue)
    );
  }

}
