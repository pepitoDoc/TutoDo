import {
  Component,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from '../../service/api.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { take } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { CreateGuideRequest } from '../../model/data';
import { Router, ActivatedRoute } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';
import { SharedService } from '../../shared/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tutodo-guide-create',
  templateUrl: './guide-create.component.html',
  styleUrl: './guide-create.component.scss',
})
export class GuideCreateComponent implements OnInit {
  guideInfo = this._nnfb.group({
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(40), Validators.maxLength(200)]],
    guideTypes: [''],
    ingredients: ['', [Validators.maxLength(100)]]
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ingredientsInput') ingredientsInput!: ElementRef<HTMLInputElement>;
  filteredTypes!: Observable<string[]>;
  readonly separatorKeysCodesTypes = [] as const;
  readonly separatorKeysCodesIngredients = [ENTER, COMMA] as const;
  guideTypes!: string[];
  ingredients: string[] = [];
  chosenTypes: string[] = [];
  announcer = inject(LiveAnnouncer);
  selectedImage!: File | null;
  loadedImage!: string | ArrayBuffer | null;

  constructor(
    private _ngZone: NgZone,
    private readonly _service: ApiService,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _sharedService: SharedService,
    private readonly _toast: ToastrService
  ) { }

  ngOnInit(): void {
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes =
          this.guideInfo.controls.guideTypes.valueChanges.pipe(
            map((guideType: string) =>
              guideType !== ''
                ? this._filter(guideType)
                : this.guideTypes.slice()
            )
          );
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
      }
    });
  }

  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  removeType(guideType: string): void {
    const index = this.chosenTypes.indexOf(guideType);
    if (index >= 0) {
      this.chosenTypes.splice(index, 1);
      this.announcer.announce(`Removed ${guideType}`);
    }
    if (this.chosenTypes.length === 4) {
      this.guideInfo.controls.guideTypes.enable();
      this.guideTypeInput.nativeElement.disabled = false;
    }
    this.guideInfo.controls.guideTypes.reset();
  }

  selectedType(event: MatAutocompleteSelectedEvent): void {
    this.chosenTypes.push(event.option.viewValue);
    if (this.chosenTypes.length === 5) {
      this.guideInfo.controls.guideTypes.disable();
      this.guideTypeInput.nativeElement.disabled = true;
    }
    this.guideTypeInput.nativeElement.value = '';
    this.guideInfo.controls.guideTypes.reset();
  }

  removeIngredient(ingredient: string): void {
    const index = this.ingredients.indexOf(ingredient);
    if (index >= 0) {
      this.ingredients.splice(index, 1);
      this.announcer.announce(`Removed ${ingredient}`);
      if (this.ingredients.length === 24) {
        this.ingredientsInput.nativeElement.disabled = false;
      }
    }
  }

  addIngredient(ingredient: MatChipInputEvent): void {
    const value = (ingredient.value || '').trim();
    if (value) {
      this.ingredients.push(value);
      if (this.ingredients.length === 25) {
        this.ingredientsInput.nativeElement.disabled = true;
      }
    }
    ingredient.chipInput!.clear();
  }

  editIngredient(ingredient: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removeIngredient(ingredient);
      return;
    }
    const index = this.ingredients.indexOf(ingredient);
    if (index >= 0) {
      this.ingredients[index] = value;
    }
  }

  guideCreate(): void {
    const { title, description } = { ...this.guideInfo.getRawValue() };
    const payload: CreateGuideRequest = {
      title: title,
      description: description,
      guideTypes: this.chosenTypes,
      ingredients: this.ingredients
    };
    const formData = new FormData();
    if (this.selectedImage !== null) formData.append('guideThumbnail', this.selectedImage);
    formData.append('createGuideRequest', new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    }));
    this._service.createGuide$(formData).subscribe({
      next: (response) => {
        if (response.includes('operation_successful')) {
          const guideIdModifying: string = response.slice(
            response.indexOf('?id=') + 4
          );
          this._sharedService.setPersistedData$({ guideIdModifying }).subscribe({
            next: () => {
              this._router.navigate([`../${TutodoRoutes.MODIFY}`], {
                relativeTo: this._route,
              });
            },
            error: (error) => {
              this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
              this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
            }
          });
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
        }
      },
      error: (err) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
      },
    });
  }

  deleteImage(): void {
    this.loadedImage = null;
    this.selectedImage = null;
  }

  onFileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.loadedImage = reader.result;
        this._toast.success(
          'Imagen cargada correctamente.',
          'Operación exitosa'
        );
      };
      reader.readAsDataURL(file);
    } else {
      this._toast.error(
        'No se ha podido cargar la imagen seleccionada.',
        'Operación fallida'
      );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter((guideType) =>
      guideType.toLowerCase().includes(filterValue)
    );
  }
}
