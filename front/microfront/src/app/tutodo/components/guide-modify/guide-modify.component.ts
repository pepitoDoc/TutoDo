import {
  Component,
  NgZone,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import {
  FormStep,
  GuideModifySteps,
  SaveGuideStepRequest,
  StepSnapshot,
} from '../../model/data';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { SharedService } from '../../shared/shared.service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { OptionDialogComponent } from '../option-dialog/option-dialog.component';
import { TutodoRoutes } from '../../tutodo.routes';

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
        description: ['', { validators: [Validators.required, Validators.minLength(20), Validators.maxLength(400)] }],
        imageFileInput: this._fb.control<File | null>(null),
        imageBase64: [''],
        loadedImage: this._fb.control<string | ArrayBuffer | null>(null),
        imageFile: this._fb.control<File | null>(null),
        saved: [false],
        modifying: [true]
      })
    ])
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('paginator') paginator!: MatPaginator;
  announcer = inject(LiveAnnouncer);
  guideId!: string;
  stepSnapshots: StepSnapshot[] = [];
  restoredGuide!: GuideModifySteps;

  constructor(
    private _ngZone: NgZone,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _fb: FormBuilder,
    private readonly _service: ApiService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _sharedService: SharedService,
    private readonly _toast: ToastrService
  ) {}

  ngOnInit(): void {
    this._sharedService.getPersistedData$('guideIdModifying').subscribe({
      next: (response) => {
        if (
          response === null ||
          response === undefined ||
          (typeof response === 'object' && Object.keys(response).length === 0)
        ) {
          this._toast.info(
            'No se ha podido encontrar ninguna guía para editar.',
            'No se ha podido acceder a la página'
          );
          this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
        } else {
          this.guideId = response.guideIdModifying;
          this._service.findGuideByIdSteps$(this.guideId).subscribe({
            next: (response) => {
              this.restoredGuide = response;
              const steps: FormStep[] = [];
              this.restoredGuide.steps.forEach((step) => {
                steps.push(
                  {
                    title: step.title,
                    description: step.description,
                    imageBase64: step.image,
                    imageFileInput: null,
                    loadedImage: null,
                    imageFile: null,
                    saved: true,
                    modifying: false
                  });
              });
              // Añado pasos en el form por cado paso recibido
              for (let i = 0; i < steps.length - 1; i++)
                this.stepsForm.controls.steps.controls.push(
                  this._createNewStep()
                );
              // Asigno valor a cada paso en el form
              for (let i = 0; i < steps.length; i++) this.disableStep(i);
              this.stepsForm.controls.steps.setValue(
                steps.length > 0
                  ? steps
                  : this.stepsForm.controls.steps.getRawValue()
              );
              this._toast.success(
                `Editando pasos de guía: ${this.restoredGuide.title}`,
                'Guía cargada'
              );
            },
            error: (response) => {
              this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
              this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
            }
          });
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
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
    const stepImage = this.stepsForm.controls.steps.controls[index].controls.imageFile.getRawValue();
    const formData = new FormData();
    if (stepImage !== null) formData.append('stepImage', stepImage);
    formData.append('saveGuideStepRequest', new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    }));
    this._service.saveGuideStep$(formData).subscribe({
      next: (response) => {
        if (response === 'guide_updated') {
          this.disableStep(index);
          const stepIndex = this.stepSnapshots.findIndex(step => step.index === index);
          this.stepSnapshots.splice(stepIndex, 1);
          this.stepsForm.controls.steps.controls[index].controls.saved.setValue(true);
          this._toast.success(
            `Se ha guardado la información sobre el paso ${index + 1}.`,
            'Información guardada'
          );
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
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
    this.stepsForm.controls.steps.controls[index].controls.imageFileInput.disable();
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
      },
      error: (error) => {
        this._toast.error('Opción no registrada correctamente');
      }
    });
  }

  enableStep(index: number): void {
    this.stepsForm.controls.steps.controls[index].controls.title.enable();
    this.stepsForm.controls.steps.controls[index].controls.description.enable();
    this.stepsForm.controls.steps.controls[index].controls.imageFileInput.enable();
    this.stepsForm.controls.steps.controls[index].controls.modifying.setValue(true);
  }

  modifyStep(index: number): void {
    this.enableStep(index);
    this.stepSnapshots.push(
      {
        title: this.stepsForm.controls.steps.controls[index].controls.title.getRawValue(),
        description: this.stepsForm.controls.steps.controls[index].controls.description.getRawValue(),
        imageBase64: this.stepsForm.controls.steps.controls[index].controls.imageBase64.getRawValue(),
        loadedImage: this.stepsForm.controls.steps.controls[index].controls.loadedImage.getRawValue(),
        imageFile: this.stepsForm.controls.steps.controls[index].controls.imageFile.getRawValue(),
        index: index
      }
    );
  }

  cancelChanges(index: number): void {
    const stepIndex = this.stepSnapshots.findIndex(step => step.index === index);
    if (stepIndex !== -1) {
      const stepSnapshot = this.stepSnapshots[stepIndex];
      this.stepsForm.controls.steps.controls[index].setValue({
        title: stepSnapshot.title,
        description: stepSnapshot.description,
        imageFile: stepSnapshot.imageFile,
        imageBase64: stepSnapshot.imageBase64,
        imageFileInput: null,
        loadedImage: stepSnapshot.loadedImage,
        modifying: false,
        saved: true
      });
      this.stepSnapshots.splice(stepIndex, 1);
      this.disableStep(index);
    } else {
      this._toast.error(
        'No se ha encontrado la información necesaria para cancelar los cambios.', 'Error en la operación');
    }
  }

  
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

  updateStepImage(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.stepsForm.controls.steps.controls[index].controls.imageFile.setValue(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.stepsForm.controls.steps.controls[index].controls.loadedImage.setValue(reader.result);
        this._toast.success(
          'Imagen cargada correctamente.',
          'Operación exitosa'
        );
      };
      reader.readAsDataURL(file);
    } else if (input.value !== '') {
      this._toast.error(
        'No se ha podido cargar la imagen seleccionada.',
        'Operación fallida'
      );
    }
  }

  nextStepValid(index: number): boolean {
    if (this.stepsForm.controls.steps.controls[index].controls.modifying.getRawValue() === true 
      || (this.stepsForm.controls.steps.controls[index + 1] 
        && this.stepsForm.controls.steps.controls[index + 1].controls.modifying.getRawValue() === true)
      || this.stepsForm.controls.steps.length === 20) {
      return true;
    } else {
      return false;
    }
  }

  deleteImage(index: number): void {
    this.stepsForm.controls.steps.controls[index].controls.imageBase64.setValue('');
    this.stepsForm.controls.steps.controls[index].controls.imageFile.setValue(null);
    this.stepsForm.controls.steps.controls[index].controls.loadedImage.setValue(null);
  }

  getCreateButtonText(index: number): string {
    if (this.stepsForm.controls.steps.length < 20) {
      return index % 4 === 3 ? 'Insertar paso en la siguiente página' : 'Insertar paso'
    } else {
      return 'Límite de pasos alcanzado'
    }
  }
  
  private _createNewStep(): FormGroup {
    return new FormGroup({
      title: this._nnfb.control('', { validators: [Validators.required, Validators.minLength(10), Validators.maxLength(50)] }),
      description: this._nnfb.control('', { validators: [Validators.required, Validators.minLength(50), Validators.maxLength(400)] }),
      imageFileInput: new FormControl<File | null>(null),
      imageBase64: this._nnfb.control(''),
      loadedImage: this._fb.control<string | ArrayBuffer | null>(null),
      imageFile: this._fb.control<File | null>(null),
      saved: this._nnfb.control(false),
      modifying: this._nnfb.control(true)
    });
  }
  
  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  
  handlePageEvent(e: PageEvent) {}

}
