import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { InsertUserRequest, LoginUserRequest } from '../../model/data';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';

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
    username: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.maxLength(100),
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256)]],
    guideTypes: ['']
  });

  inputState = true;
  hidePasswordLogin = true;
  hidePasswordRegister = true;
  hidePasswordConfirm = true;

  loginMessage = '';
  registerMessage = '';
  filteredTypes!: Observable<string[]>;
  guideTypes!: string[];
  chosenTypes: string[] = [];
  readonly separatorKeysCodesTypes = [] as const;
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  constructor(
    private readonly _service: ApiService,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _toast: ToastrService
  ) { }

  ngOnInit(): void {
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes =
          this.registerForm.controls.guideTypes.valueChanges.pipe(
            map((guideType: string) =>
              guideType !== ''
                ? this._filter(guideType)
                : this.guideTypes.slice()
            )
          );
      },
      error: (error) => {
        this._toast.error('El servidor no se encuentra disponible', 'Error del servidor');
      }
    });
  }

  login(): void {
    const data: LoginUserRequest = { ...this.loginForm.getRawValue() };
    this._service.loginUser$(data).subscribe({
      next: (response) => {
        if (response === 'login_succesful' || response === 'already_logged') {
          this._toast.success('Se ha iniciado sesión correctamente');
          this.loginMessage = '';
          this._router.navigate([`../${TutodoRoutes.TUTODO}`], { relativeTo: this._route });
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
    const data: InsertUserRequest = { ...this.registerForm.getRawValue(), preferences: this.chosenTypes };
    if (this.registerForm.controls.password.getRawValue()
      === this.registerForm.controls.passwordConfirm.getRawValue()) {
      this._service.insertUser$(data).subscribe({
        next: (response) => {
          if (response === 'operation_successful') {
            this._toast.success('Se ha creado el usuario correctamente', 'Usuario creado');
            this.registerMessage = '';
            this.changeInputState();
          } else {
            if (response === 'username_takenemail_taken') {
              this._toast.warning('El correo electrónico y nombre de usuario introducido ya existen.', 'Credenciales no disponibles');
              this.registerMessage = 'El correo electrónico y nombre de usuario introducido ya existen.';
            } else if (response === 'username_taken') {
              this._toast.warning('El nombre de usuario introducido ya existe.', 'Credenciales no disponibles');
              this.registerMessage = 'El nombre de usuario introducido ya existe.';
            } else if (response === 'email_taken') {
              this._toast.warning('El correo electrónico introducido ya existe.', 'Credenciales no disponibles');
              this.registerMessage = 'El correo electrónico introducido ya existe.';
            } else {
              this._toast.warning('Ha habido un error en el proceso de creación de usuario.', 'Error en el registro');
              this.registerMessage = 'Ha habido un error en el proceso de creación de usuario; por favor, inténtelo de nuevo.';
            }
          }
        },
        error: (err) => {
          this.registerMessage = 'Error del servidor al registrar el usuario';
          this._toast.error('Error del servidor al iniciar sesión.', 'Error del servidor');
        }
      });
    } else {
      this.registerMessage = 'Las contraseñas introducidas no coinciden';
      this._toast.warning('Las contraseñas introducidas no coinciden.', 'Credenciales no válidas');
    }
  }

  changeInputState(): void {
    this.inputState = !this.inputState;
  }

  removeType(guideType: string): void {
    const index = this.chosenTypes.indexOf(guideType);
    if (index >= 0) {
      this.chosenTypes.splice(index, 1);
      this.announcer.announce(`Removed ${guideType}`);
    }
    if (this.chosenTypes.length === 4) {
      this.registerForm.controls.guideTypes.enable();
      this.guideTypeInput.nativeElement.disabled = false;
    }
    this.registerForm.controls.guideTypes.reset();
  }

  selectedType(event: MatAutocompleteSelectedEvent): void {
    this.chosenTypes.push(event.option.viewValue);
    if (this.chosenTypes.length === 5) {
      this.registerForm.controls.guideTypes.disable();
      this.guideTypeInput.nativeElement.disabled = true;
    }
    this.guideTypeInput.nativeElement.value = '';
    this.registerForm.controls.guideTypes.reset();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter((guideType) =>
      guideType.toLowerCase().includes(filterValue)
    );
  }

}
