import { Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { NonNullableFormBuilder, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { Observable, map, take } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatChipEditedEvent, MatChipGrid, MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { StepImageFile, LoadedImage, StepSnapshot, Guide, SaveGuideInfoRequest } from '../../model/data';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'tutodo-guide-modify-info',
  templateUrl: './guide-modify-info.component.html',
  styleUrl: './guide-modify-info.component.scss'
})
export class GuideModifyInfoComponent implements OnInit {

  guideInfo = this._nnfb.group({
    title: ['', { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(50)] }],
    description: ['', { validators: [Validators.required, Validators.minLength(40), Validators.maxLength(100)] }],
    guideTypes: [''],
    ingredients: [''],
    imageFile: this._fb.control<File | null>(null),
    imageBase64: ['']
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('chipGrid') chipGrid!: MatChipGrid;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ingredientsInput') ingredientsInput!: ElementRef<HTMLInputElement>;
  filteredTypes!: Observable<string[]>;
  addOnBlur = true;
  readonly separatorKeysCodesTypes = [] as const; // NO ESTÁ ASIGNADO
  readonly separatorKeysCodesIngredients = [ENTER, COMMA] as const;
  guideTypes!: string[];
  chosenTypes: string[] = [];
  ingredients: string[] = [];
  announcer = inject(LiveAnnouncer);
  guideId!: string;

  guideThumbnailBase64!: File;
  guideThumbnailLoaded!: string | ArrayBuffer | null;
  stepImagesBase64: StepImageFile[] = [];
  stepImagesLoaded: LoadedImage[] = [];

  stepSnapshots: StepSnapshot[] = [];

  restoredGuide!: Guide;
  isPublished = false;
  showGuideInfo = false;
  isModifyGuideInfo = false;
  enableInfoInputs = false;

  constructor(
    private _ngZone: NgZone,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _fb: FormBuilder,
    private readonly _service: ApiService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _sharedService: SharedService,
    private readonly _toast: ToastrService
  ) { }

  ngOnInit(): void {
    this._sharedService
      .getPersistedData$('guideIdModifying')
      .subscribe((response) => {
        if (
          response === null ||
          response === undefined ||
          (typeof response === 'object' && Object.keys(response).length === 0)
        ) {
          this._toast.info(
            'No se ha podido encontrar ninguna guía para editar.',
            'No se ha podido acceder a la página'
          );
          this._router.navigate([`../`], { relativeTo: this._route });
        } else {
          this.guideId = response.guideIdModifying;
          this._service.findGuideById$(this.guideId).subscribe((response) => {
            this.restoredGuide = response;
            this.isPublished = this.restoredGuide.published;
            this.guideInfo.setValue({
              title: this.restoredGuide.title,
              description: this.restoredGuide.description,
              guideTypes: '',
              ingredients: '',
              imageBase64: this.restoredGuide.thumbnail,
              imageFile: null
            });
            this.chosenTypes = this.restoredGuide.guideTypes;
            this.ingredients = this.restoredGuide.ingredients === null ? [] : this.restoredGuide.ingredients;
            this.saveGuideInfo(false);
            this._toast.success(
              `Se ha restaurado el progreso de edición de la guía: ${this.restoredGuide.title}`,
              'Progreso de guía restaurado'
            );
          });
        }
      });
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
      }
    });
  }

  saveGuideInfo(save: boolean): void {
    if (save) {
      const payload: SaveGuideInfoRequest = {
        guideId: this.guideId,
        title: this.guideInfo.controls.title.value,
        description: this.guideInfo.controls.description.value,
        guideTypes: this.chosenTypes,
        ingredients: this.ingredients,
        thumbnail: this.restoredGuide.thumbnail
      };
      const formData = new FormData();
      if (this.guideThumbnailBase64 !== undefined) formData.append('guideThumbnail', this.guideThumbnailBase64);
      formData.append('saveGuideInfoRequest', new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }));
      this._service.saveGuideInfo$(formData).subscribe({
        next: (response) => {
          if (response === 'guide_updated') {
            this.disableGuideInfo();
            this._toast.success(
              'Se ha guardado la información básica de la guía introducida.',
              'Información guardada'
            );
          }
        },
        error: () => {
          this._toast.error(
            'Ha habido un error guardando la información básica de la guía.',
            'Operación fallida'
          );
        }
      });
    }
  }

  enableGuideInfo(): void {
    this.guideInfo.controls.description.enable();
    this.guideInfo.controls.title.enable();
    this.guideInfo.controls.guideTypes.enable();
    this.guideInfo.controls.imageFile.enable();
    this.isModifyGuideInfo = true;
    this.enableInfoInputs = false;
    if (this.guideTypeInput !== undefined)
      this.guideTypeInput.nativeElement.disabled = false;
    if (this.ingredientsInput !== undefined)
      this.ingredientsInput.nativeElement.disabled = false;
    if (this.chipGrid !== undefined) this.chipGrid.disabled = false;
  }

  disableGuideInfo(): void {
    this.guideInfo.controls.description.disable();
    this.guideInfo.controls.title.disable();
    this.guideInfo.controls.guideTypes.disable();
    this.guideInfo.controls.imageFile.disable();
    this.isModifyGuideInfo = false;
    this.enableInfoInputs = true;
    if (this.guideTypeInput !== undefined)
      this.guideTypeInput.nativeElement.disabled = true;
    if (this.ingredientsInput !== undefined)
      this.ingredientsInput.nativeElement.disabled = true;
    if (this.chipGrid !== undefined) this.chipGrid.disabled = true;
  }

  updateGuideThumbnail(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.guideThumbnailBase64 = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.guideThumbnailLoaded = reader.result;
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

  changePublished(): void {
    this._toast.clear();
    this.isPublished = !this.isPublished;
    this._toast.info(
      'Para guardar este cambio, haga click en "Guardar cambios".',
      'Estado de publicación cambiado: ' +
      (this.isPublished ? 'publicado' : 'no publicado')
    );
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
    }
  }

  addIngredient(ingredient: MatChipInputEvent): void {
    const value = (ingredient.value || '').trim();
    if (value) {
      this.ingredients.push(value);
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter((guideType) =>
      guideType.toLowerCase().includes(filterValue)
    );
  }

}
