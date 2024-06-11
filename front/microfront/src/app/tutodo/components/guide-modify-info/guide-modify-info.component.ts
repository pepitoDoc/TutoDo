import { Component, NgZone, OnInit, ViewChild, inject } from '@angular/core';
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
import { Guide, SaveGuideInfoRequest, GuideInfoSnapshot } from '../../model/data';
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
    imageFile: this._fb.control<File | null>(null)
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('chipGrid') chipGrid!: MatChipGrid;
  filteredTypes!: Observable<string[]>;
  readonly separatorKeysCodesTypes = [] as const; // NO ESTÁ ASIGNADO
  readonly separatorKeysCodesIngredients = [ENTER, COMMA] as const;
  guideTypes!: string[];
  chosenTypes: string[] = [];
  ingredients: string[] = [];
  announcer = inject(LiveAnnouncer);
  guideId!: string;
  guideThumbnailFile!: File | null;
  guideThumbnailLoaded!: string | ArrayBuffer | null;
  guideInfoSnapshot!: GuideInfoSnapshot; 
  restoredGuide!: Guide;
  isPublished = false;
  isModifyGuideInfo = false;
  ingredientsFlag = false;

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
    this._sharedService.getPersistedData$('guideIdModifying').subscribe((response) => {
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
            this.isPublished = this.restoredGuide.steps.length >= 5 
              ? this.restoredGuide.published : false;
            this.guideInfo.setValue({
              title: this.restoredGuide.title,
              description: this.restoredGuide.description,
              guideTypes: '',
              ingredients: '',
              imageFile: null
            });
            this.chosenTypes = this.restoredGuide.guideTypes;
            this.ingredients = this.restoredGuide.ingredients === null ? [] : this.restoredGuide.ingredients;
            this._toast.success(
              `Editando información de guía: ${this.restoredGuide.title}`,
              'Guía cargada'
            );
          });
        }
      });
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes = this.guideInfo.controls.guideTypes.valueChanges.pipe(
            map((guideType: string) =>
              guideType !== '' ? this._filter(guideType) : this.guideTypes.slice()
            )
          );
      },
      error: (error) => {
        // TODO
      }
    });
  }

  saveGuideInfo(): void {
    const payload: SaveGuideInfoRequest = {
      guideId: this.guideId,
      title: this.guideInfo.controls.title.value,
      description: this.guideInfo.controls.description.value,
      guideTypes: this.chosenTypes,
      ingredients: this.ingredients,
      published: this.isPublished,
      thumbnail: this.restoredGuide.thumbnail
    };
    const formData = new FormData();
    if (this.guideThumbnailFile !== null) formData.append('guideThumbnail', this.guideThumbnailFile);
    formData.append('saveGuideInfoRequest', new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    }));
    this._service.saveGuideInfo$(formData).subscribe({
      next: (response) => {
        if (response === 'guide_updated') {
          this.isModifyGuideInfo = false;
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

  updateGuideThumbnail(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.guideThumbnailFile = file;
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

  deleteImage(): void {
    this.restoredGuide.thumbnail = '';
    this.guideThumbnailFile = null;
    this.guideThumbnailLoaded = null;
  }

  cancelChanges(): void {
    this.isModifyGuideInfo = false;
    this.guideInfo.setValue(
      {
        title: this.guideInfoSnapshot.title,
        description: this.guideInfoSnapshot.description,
        guideTypes: '',
        ingredients: '',
        imageFile: null
      }
    );
    this.isPublished = this.guideInfoSnapshot.isPublished;
    this.chosenTypes = this.guideInfoSnapshot.guideTypes;
    this.ingredients = this.guideInfoSnapshot.ingredients;
    this.restoredGuide.thumbnail = this.guideInfoSnapshot.imageBase64;
    this.guideThumbnailFile = this.guideInfoSnapshot.imageFile;
    this.guideThumbnailLoaded = this.guideInfoSnapshot.loadedImage;
  }

  modifyGuideInfo(): void {
    this.isModifyGuideInfo = true;
    this.guideInfoSnapshot = {
      title: this.guideInfo.controls.title.getRawValue(),
      description: this.guideInfo.controls.description.getRawValue(),
      guideTypes: this.chosenTypes,
      ingredients: this.ingredients,
      imageBase64: this.restoredGuide.thumbnail,
      imageFile: this.guideThumbnailFile,
      isPublished: this.isPublished,
      loadedImage: this.guideThumbnailLoaded
    };
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
    }
    this.guideInfo.controls.guideTypes.reset();
  }

  selectedType(event: MatAutocompleteSelectedEvent): void {
    this.chosenTypes.push(event.option.viewValue);
    if (this.chosenTypes.length === 5) {
      this.guideInfo.controls.guideTypes.disable();
    }
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
    if (value && this.guideInfoSnapshot) {
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

  listToString(list: string[]): string {
    if (list.length > 0) {
      let formattedList = '';
      list.forEach(string => formattedList = formattedList + `${string}, `);
      return formattedList.substring(0, formattedList.length - 2);
    }
    return '';
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter((guideType) =>
      guideType.toLowerCase().includes(filterValue)
    );
  }

}
