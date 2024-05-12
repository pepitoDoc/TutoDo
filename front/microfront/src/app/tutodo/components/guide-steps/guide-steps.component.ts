import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { GuideStep, SaveGuideStepsRequest, Step } from '../../model/data';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { SharedService } from '../../shared/shared.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'tutodo-guide-steps',
  templateUrl: './guide-steps.component.html',
  styleUrl: './guide-steps.component.scss'
})
export class GuideStepsComponent implements OnInit, OnDestroy {

  stepsForm = this._fb.group({
    steps: this._fb.array([
      this._fb.group({
        title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
        description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(200)]],
        saved: [false]
      })
    ])
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('paginator') paginator!: MatPaginator;
  savedSteps: GuideStep[] = [];
  guideId!: string;
  isPublished = false;
  private unsubscribe = new Subject<void>();

  constructor(
    private readonly _fb: NonNullableFormBuilder,
    private readonly _service: ApiService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _sharedService: SharedService,
    private readonly _toast: ToastrService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this._sharedService.getPersistedData$('guideId').subscribe(response => {
      this.guideId = response.guideId
      this._service.findGuideIsPublished$(this.guideId).subscribe(response => this.isPublished = response);
    });
  }

  addStep(index: number): void {
    this.stepsForm.controls.steps.controls.splice(index + 1, 0, this.createNewStep());
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

  saveProgress(): void {
    const steps: Step[] = this.stepsForm.getRawValue().steps.map(step => { return <Step>{ title: step.title, description: step.description } });
    const payload: SaveGuideStepsRequest = {
      guideId: this.guideId,
      steps: steps,
      published: this.isPublished
    };
    this._service.saveGuideSteps$(payload).subscribe({
      next: (response) => {
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

  private createNewStep(): FormGroup {
    const group = this.stepsForm.controls.steps.controls.copyWithin(0, 1)[0];
    group.reset();
    return group;
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

}
