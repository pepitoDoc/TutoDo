import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { FormStep, Guide, GuideStep, SaveGuideInfoRequest, SaveGuideStepsRequest, Step } from '../../model/data';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { SharedService } from '../../shared/shared.service';
import { Observable, Subject, map, take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TutodoRoutes } from '../../tutodo.routes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipGrid } from '@angular/material/chips';


@Component({
  selector: 'tutodo-guide-modify',
  templateUrl: './guide-modify.component.html',
  styleUrl: './guide-modify.component.scss'
})
export class GuideModifyComponent implements OnInit, OnDestroy {

  stepsForm = this._nnfb.group({
    steps: this._nnfb.array([
      this._nnfb.group({
        title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
        saved: [false]
      })
    ])
  });
  guideInfo = this._nnfb.group({
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(40), Validators.maxLength(100)]],
    guideTypes: ['']
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('chipGrid') chipGrid!: MatChipGrid;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  filteredTypes!: Observable<string[]>;
  addOnBlur = true;
  readonly _separatorKeysCodes = [] as const;
  guideTypes!: string[];
  chosenTypes: string[] = [];
  announcer = inject(LiveAnnouncer);
  guideId!: string;
  restoredGuide!: Guide;
  isPublished = false;
  showGuideInfo = false;
  isModifyGuideInfo = false;
  isGuideTypeInput = false;
  private _unsubscribe = new Subject<void>();

  constructor(
    private _ngZone: NgZone,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _service: ApiService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _sharedService: SharedService,
    private readonly _toast: ToastrService
  ) { }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  ngOnInit(): void {
    this._sharedService.getPersistedData$('guideIdModifying').subscribe(response => {
      if (response === null || response === undefined || (typeof response === 'object' && Object.keys(response).length === 0)) {
        this._toast.info('No se ha podido encontrar ninguna guía para editar.', 'No se ha podido acceder a la página');
        this._router.navigate([`../`], { relativeTo: this._route });
      } else {
        this.guideId = response.guideIdModifying;
        this._service.findGuideById$(this.guideId).subscribe(response => {
          this.restoredGuide = response;
          const steps: FormStep[] = [];
          this.restoredGuide.steps.forEach(step => { steps.push({ ...step, saved: true }) });
          for (let i = 0; i < steps.length - 1; i++)  this.stepsForm.controls.steps.controls.push(this._createNewStep());
          for (let i = 0; i < steps.length; i++)  this.saveStep(i);
          this.stepsForm.controls.steps.setValue(steps.length > 0 ? steps : this.stepsForm.controls.steps.getRawValue());
          this.isPublished = this.restoredGuide.published;
          this.guideInfo.setValue({ title: this.restoredGuide.title, description: this.restoredGuide.description, guideTypes: '' });
          this.chosenTypes = this.restoredGuide.guideTypes;
          this.saveGuideInfo();
          this._toast.success(`Se ha restaurado el progreso de edición de la guía: ${this.restoredGuide.title}`, 'Progreso de guía restaurado');
        });
      }
    });
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes = this.guideInfo.controls.guideTypes.valueChanges.pipe(
          map((guideType: string) => (guideType !== '' ? this._filter(guideType) : this.guideTypes.slice())),
        );
      }
    });
  }

  addStep(index: number): void {
    this.stepsForm.controls.steps.controls.splice(index + 1, 0, this._createNewStep());
  }

  saveStep(index: number): void {
    this.stepsForm.controls.steps.controls[index].controls.title.disable();
    this.stepsForm.controls.steps.controls[index].controls.description.disable();
    this.stepsForm.controls.steps.controls[index].controls.saved.setValue(true);
  }

  cancelStep(index: number): void {
    this.steps.controls.splice(index, 1);
  }

  modifyStep(index: number): void {
    this.stepsForm.controls.steps.controls[index].controls.title.enable();
    this.stepsForm.controls.steps.controls[index].controls.description.enable();
    this.stepsForm.controls.steps.controls[index].controls.saved.setValue(false);
  }

  saveGuideInfo(): void {
    const payload: SaveGuideInfoRequest = { 
      guideId: this.guideId,
      title: this.guideInfo.controls.title.value,
      description: this.guideInfo.controls.description.value,
      guideTypes: this.chosenTypes
    };
    this._service.saveGuideInfo$(payload).subscribe(response => console.log(response));
    this.guideInfo.controls.description.disable();
    this.guideInfo.controls.title.disable();
    this.guideInfo.controls.guideTypes.disable();
    this.isModifyGuideInfo = false;
    this.isGuideTypeInput = true;
    if (this.guideTypeInput !== undefined) this.guideTypeInput.nativeElement.disabled = true;
    if (this.chipGrid !== undefined) this.chipGrid.disabled = true;
  }

  modifyGuideInfo(): void {
    this.guideInfo.controls.description.enable();
    this.guideInfo.controls.title.enable();
    this.guideInfo.controls.guideTypes.enable();
    this.isModifyGuideInfo = true;
    this.isGuideTypeInput = false;
    if (this.guideTypeInput !== undefined) this.guideTypeInput.nativeElement.disabled = false;
    if (this.chipGrid !== undefined) this.chipGrid.disabled = false;
  }

  showModifyGuideInfo(mode: boolean): void {
    this.guideInfo.controls.description.disable();
    this.guideInfo.controls.title.disable();
    this.guideInfo.controls.guideTypes.disable();
    this.isGuideTypeInput = true;
    this.showGuideInfo = mode;
  }

  saveProgress(): void {
    const steps: Step[] = this.stepsForm.getRawValue().steps.map(step => { return <Step>{ title: step.title, description: step.description } });
    const payload: SaveGuideStepsRequest = {
      guideId: this.guideId,
      steps: steps,
      published: this.isPublished
    };
    this._service.saveGuideSteps$(payload).subscribe({
      next: (response) => {
        // Comprobar return
        this._toast.success('Se ha guardado el progreso de la guía.', 'Progreso guardado');
      },
      error: (err) => {
        this._toast.error(err, 'Error en la operación');
      }
    });
  }

  changePublished(): void {
    this._toast.clear();
    this.isPublished = !this.isPublished;
    this._toast.info('Para guardar este cambio, haga click en "Guardar cambios".',
      'Estado de publicación cambiado: ' + (this.isPublished ? 'publicado' : 'no publicado'));
  }

  handlePageEvent(e: PageEvent) {

  }

  showSteps(index: number, page: number, pageSize: number): boolean {
    const offset: number = (pageSize * (page + 1)) - index - 1;
    return offset >= 0 && offset < pageSize;
  }

  get steps() {
    return this.stepsForm.controls.steps;
  }

  private _createNewStep(): FormGroup {
    return this._nnfb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
      saved: [false]
    });
  }

  private _createNewStepWithValue(values: FormStep): FormGroup {
    return this._nnfb.group({
      title: [values.title, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      description: [values.description, [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
      saved: [values.saved]
    });
  }

  showInfo(): void {
    this._dialog.open(InfoDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: 'Información sobre la creación de guías',
        text: ['Para la creación de guías, deberá tener en cuenta lo siguiente:',
          '1. La guía debe de tener mínimo 5 pasos',
          '2. La guía podrá tener como máximo 20 pasos']
      }
    });
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  remove(guideType: string): void {
    if (this.isModifyGuideInfo) {
      const index = this.chosenTypes.indexOf(guideType);
      if (index >= 0) {
        this.chosenTypes.splice(index, 1);
        this.announcer.announce(`Removed ${guideType}`);
      }
      if (this.chosenTypes.length === 4) this.guideInfo.controls['guideTypes'].enable();
      this.guideInfo.controls.guideTypes.reset();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.chosenTypes.push(event.option.viewValue);
    if (this.chosenTypes.length === 5) this.guideInfo.controls['guideTypes'].disable();
    this.guideTypeInput.nativeElement.value = '';
    this.guideInfo.controls.guideTypes.reset();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter(guideType => guideType.toLowerCase().includes(filterValue));
  }

}
