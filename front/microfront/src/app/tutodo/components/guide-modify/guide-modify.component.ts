import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import {
  FormStep,
  Guide,
  LoadedImage,
  SaveGuideInfoRequest,
  SaveGuideStepRequest,
  StepImageFile,
  StepSnapshot,
} from '../../model/data';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { SharedService } from '../../shared/shared.service';
import { Observable, Subject, map, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipEditedEvent, MatChipGrid, MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { OptionDialogComponent } from '../option-dialog/option-dialog.component';

@Component({
  selector: 'tutodo-guide-modify',
  templateUrl: './guide-modify.component.html',
  styleUrl: './guide-modify.component.scss',
})
export class GuideModifyComponent implements OnInit {

  stepsForm = this._nnfb.group({
    steps: this._nnfb.array([
      this._nnfb.group({
        title:  ['', { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(50)] }],
        description: ['', { validators: [Validators.required, Validators.minLength(50), Validators.maxLength(400)] }],
        imageFile: this._fb.control<File | null>(null),
        imageBase64: [''],
        saved: [false],
        modifying: [false]
      })
    ])
  });
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
  ) {}

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
            const steps: FormStep[] = [];
            this.restoredGuide.steps.forEach((step) => {
              steps.push(
                { title: step.title, description: step.description, imageBase64: step.image, imageFile: null, saved: true, modifying: false });
            });
            // Añado pasos
            for (let i = 0; i < steps.length - 1; i++)
              this.stepsForm.controls.steps.controls.push(
                this._createNewStep()
              );
            // Asigno valor
            for (let i = 0; i < steps.length; i++) this.disableStep(i);
            this.stepsForm.controls.steps.setValue(
              steps.length > 0
                ? steps
                : this.stepsForm.controls.steps.getRawValue()
            );
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

  addStep(index: number): void {
    this.stepsForm.controls.steps.controls.splice(
      index + 1,
      0,
      this._createNewStep()
    );
    if (index % 4 === 3)
      this._toast.info(
        'Nuevo paso añadido en la siguiente página; puede avanzar con el paginador del fondo de la página.',
        'Paso añadido en siguiente página'
      );
  }

  saveStep(index: number): void {
    const step = this.stepsForm.controls.steps.controls[index].getRawValue();
    const payload: SaveGuideStepRequest = {
      guideId: this.guideId,
      title: step.title,
      description: step.description,
      image: step.imageBase64,
      stepIndex: index,
      saved: step.saved
    };
    const stepImage = this.stepImagesBase64.find(step => step.index === index)?.image;
    const formData = new FormData();
    if (stepImage !== undefined) formData.append('stepImage', stepImage);
    formData.append('saveGuideStepRequest', new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    }));
    this._service.saveGuideStep$(formData).subscribe({
      next: (response) => {
        if (response === 'guide_updated') {
          this.disableStep(index);
          this.stepsForm.controls.steps.controls[index].controls.saved.setValue(true);
          this._toast.success(
            `Se ha guardado la información sobre el paso ${index + 1}.`,
            'Información guardada'
          );
        }
      },
      error: () => {
        this._toast.error(
          `Ha habido un error guardando la información sobre el paso ${index}.`,
          'Operación fallida'
        );
      }
    });
  }

  disableStep(index: number) {
    this.stepsForm.controls.steps.controls[index].controls.title.disable();
    this.stepsForm.controls.steps.controls[index].controls.description.disable();
    this.stepsForm.controls.steps.controls[index].controls.imageFile.disable();
    this.stepsForm.controls.steps.controls[index].controls.modifying.setValue(false);
  }

  deleteStep(index: number): void {
    this._dialog.open(OptionDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: `¿Desea eliminar el paso ${index + 1}?`
      }
    }).afterClosed().subscribe({
      next: (response) => {
        if (response === true) {
          if (this.stepsForm.controls.steps.controls[index].controls.saved.getRawValue() === true) {
            this._service.deleteGuideStep$({ guideId: this.guideId, stepIndex: index }).subscribe({
              next: (response) => {
                if (response === 'guide_updated') {
                  this.stepsForm.controls.steps.controls.splice(index, 1);
                  this._toast.success(
                    `Se ha eliminado el paso ${index + 1}.`,
                    'Paso eliminado'
                  );
                }
              },
              error: () => {
                this._toast.error(
                  `Ha habido un error eliminando el paso ${index + 1}.`,
                  'Operación fallida'
                );
              }
            });
          } else {
            this.stepsForm.controls.steps.controls.splice(index, 1);
          }
        }
      }
    });
  }

  enableStep(index: number): void {
    this.stepsForm.controls.steps.controls[index].controls.title.enable();
    this.stepsForm.controls.steps.controls[index].controls.description.enable();
    this.stepsForm.controls.steps.controls[index].controls.imageFile.enable();
    this.stepsForm.controls.steps.controls[index].controls.modifying.setValue(true);
  }

  modifyStep(index: number): void {
    this.enableStep(index);
    this.stepSnapshots.push(
      {
        title: this.stepsForm.controls.steps.controls[index].controls.title.getRawValue(),
        description: this.stepsForm.controls.steps.controls[index].controls.description.getRawValue(),
        imageBase64: this.stepsForm.controls.steps.controls[index].controls.imageBase64.getRawValue(),
        loadedImage: this.findLoadedImage(index)?.image,
        imageFile: this.stepImagesBase64.find(stepImage => stepImage.index === index)?.image,
        index: index
      }
    );
  }

  cancelChanges(index: number): void {
    const stepSnapshot = this.stepSnapshots.find(step => step.index === index);
    if (stepSnapshot !== undefined) {
      this.stepsForm.controls.steps.controls[index].setValue({
        title: stepSnapshot.title,
        description: stepSnapshot.description,
        imageBase64: stepSnapshot.imageBase64,
        imageFile: null,
        modifying: false,
        saved: true
      });
      if (stepSnapshot.loadedImage !== undefined) {
        const loadedImageIndex = this.stepImagesLoaded.findIndex(stepImage => stepImage.index === index);
        const imageBase64Index = this.stepImagesBase64.findIndex(stepImage => stepImage.index === index);
        this.stepImagesLoaded.splice(loadedImageIndex, 1, { index: index, image: stepSnapshot.loadedImage });
        stepSnapshot.imageFile === undefined
          ? this.stepImagesBase64.splice(imageBase64Index, 1)
          : this.stepImagesBase64.splice(imageBase64Index, 1, { index: index, image: stepSnapshot.imageFile });
      }
      this.stepSnapshots.splice(index, 1);
      this.disableStep(index);
    } else {
      this._toast.error(
        'No se ha encontrado la información necesaria para cancelar los cambios.', 'Error en la operación');
    }
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

  showModifyGuideInfo(mode: boolean): void {
    this.disableGuideInfo();
    this.showGuideInfo = mode;
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

  handlePageEvent(e: PageEvent) {}

  showSteps(index: number, page: number, pageSize: number): boolean {
    const offset: number = pageSize * (page + 1) - index - 1;
    return offset >= 0 && offset < pageSize;
  }

  showInfo(): void {
    this._dialog.open(InfoDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: 'Información sobre la creación de guías',
        text: [
          'Para publicar una guía, deberá tener en cuenta lo siguiente:',
          '1. La guía debe de tener mínimo 5 pasos',
          '2. La guía podrá tener como máximo 20 pasos',
        ]
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

  findLoadedImage(index: number): LoadedImage | undefined {
    return this.stepImagesLoaded.find(step => step.index === index);
  }

  updateStepImage(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const imageStepIndex = this.stepImagesBase64.findIndex(stepImage => stepImage.index === index);
      imageStepIndex !== -1 
        ? this.stepImagesBase64[imageStepIndex].image = file 
        : this.stepImagesBase64.push({ index: index, image: file });
      const reader = new FileReader();
      reader.onload = () => {
        const imageLoadedIndex = this.stepImagesLoaded.findIndex(loadedImage => loadedImage.index === index);
        imageLoadedIndex !== -1
          ? this.stepImagesLoaded[imageLoadedIndex].image = reader.result
          : this.stepImagesLoaded.push({ index: index, image: reader.result });
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

  nextStepValid(index: number): boolean {
    if (this.stepsForm.controls.steps.controls[index].controls.modifying.getRawValue() === true 
      || (!!this.stepsForm.controls.steps.controls[index + 1] 
      && this.stepsForm.controls.steps.controls[index + 1].controls.modifying.getRawValue() === true)) {
      return true;
    } else {
      return false;
    }
  }

  // deleteImage(index: number, source: boolean, type: boolean): void {
  //   // Image base 64
  //   if (source === true) {
  //     if (type === true) {
  //       this.stepsForm.controls.steps.controls[index].controls.imageBase64.setValue('');
  //     } else {
  //       const imageStepIndex = this.stepImagesBase64.findIndex(stepImage => stepImage.index === index);
  //       if (imageStepIndex !== -1) {
  //         this.stepImagesBase64.splice(imageStepIndex, 1);
  //       }
  //     }
  //   // Image loaded
  //   } else {
  //     if (type === true) {
  //       this.restoredGuide.thumbnail = '';
  //     } else {
  //       this.guideThumbnailLoaded = null;
  //     }
  //   }
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter((guideType) =>
      guideType.toLowerCase().includes(filterValue)
    );
  }
  
  private _createNewStep(): FormGroup {
    return new FormGroup({
      title: this._nnfb.control('', { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(50)] }),
      description: this._nnfb.control('', { validators: [Validators.required, Validators.minLength(50), Validators.maxLength(400)] }),
      imageFile: new FormControl<File | null>(null),
      imageBase64: this._nnfb.control(''),
      saved: this._nnfb.control(false),
      modifying: this._nnfb.control(true)
    });
  }
}
