import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Validators, NonNullableFormBuilder } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddCommentRequest, AddRatingRequest, DeleteCommentRequest, GuideVisualizeInfo } from '../../model/data';
import { take } from 'rxjs';
import { UserData } from '../../model/user-data';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { OptionDialogComponent } from '../option-dialog/option-dialog.component';
import { TutodoRoutes } from '../../tutodo.routes';

@Component({
  selector: 'tutodo-guide-see',
  templateUrl: './guide-see.component.html',
  styleUrl: './guide-see.component.scss'
})
export class GuideSeeComponent implements OnInit {

  guideWatching!: GuideVisualizeInfo;
  currentStep = 0;
  ratings: { description: string, punctuation: number }[] = [{ description: '1 (Mala)', punctuation: 1 }, { description: '2 (Mejorable)', punctuation: 2 },
    { description: '3 (Bueno)', punctuation: 3 }, { description: '4 (Superior)', punctuation: 4 }, { description: '5 (Excelente)', punctuation: 5 }];
  comment = this._nnfb.group({
    text: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]]
  });
  userRating!: number;
  userData!: UserData;

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  
  constructor(
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _service: ApiService,
    private readonly _shared: SharedService,
    private readonly _toast: ToastrService,
    private _ngZone: NgZone
  ) {
    this.userData = this._route.snapshot.data['userData'];
  }

  ngOnInit(): void {
    const guideId = this._route.snapshot.paramMap.get('id');
    if (guideId !== null) {
      this._service.findGuideByIdVisualize$(guideId).subscribe({
        next: (response) => {
          if (response !== null && response !== undefined) {
            this.guideWatching = response;
            if (this.guideWatching.ownership) this.comment.disable();
            if (this.guideWatching.completed) this.currentStep = this.guideWatching.steps.length;
            this.userRating = this.guideWatching.userRating;
          }
        },
        error: (error) => {
          this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
          this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
        }
      })
    } else {
      this._toast.info('No se ha podido encontrar la guía seleccionada.', 'No se ha podido acceder a la página');
      this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
    }
  }

  nextStep(): void {
    this.currentStep++;
    this._shared.setPersistedData$({ [this.guideWatching.id]: this.currentStep }).subscribe();
    if (this.currentStep === this.guideWatching.steps.length) {
      this._service.addCompleted$(this.guideWatching.id).subscribe({
        next: (response) => {
          if (response === 'operation_successful') {
            this._toast.success('Ahora puede añadir una puntuación a la guía o dejar un comentario.',
              '¡Ha llegado al final de la guía!');
            this.guideWatching.completed = true;
          } else {
            this._toast.error('Error en la operación', 'Error del servidor');
          }
        },
        error: (error) => {
          this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
          this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
        }
      });
    }
  }

  previousStep(): void {
    this.currentStep--;
    this._shared.setPersistedData$({[this.guideWatching.id]: this.currentStep}).subscribe();
  }

  submitRating(punctuation: number): void {
    const payload: AddRatingRequest = {
      guideId: this.guideWatching.id,
      punctuation: punctuation
    };
    this._service.submitRating$(payload).subscribe({
      next: (response) => {
        if (response === 'guide_updated') {
          this.userRating = punctuation;
          this._toast.clear();
          this._toast.success('¡Gracias por puntuar la guía!', 'Puntuación registrada');
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
      }
    });
  }

  submitComment(): void {
    const payload: AddCommentRequest = {
      guideId: this.guideWatching.id,
      comment: this.comment.controls.text.value
    };
    this._service.submitComment$(payload).subscribe({
      next: (response) => {
        if (response.result === 'operation_successful') {
          this.guideWatching.comments.push(response.comment);
          this.comment.reset();
          this.comment.controls.text.setErrors(null);
          this._toast.success('Su comentario se ha publicado correctamente', 'Comentario publicado')
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
      }
    });
  }

  deleteComment(index: number): void {
    this._dialog.open(OptionDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: '¿Desea eliminar este comentario?',
      }
    }).afterClosed().subscribe({
      next: (response) => {
        if (response === true) {
          const { userId, username, text, date } = this.guideWatching.comments[index];
          const payload: DeleteCommentRequest = { guideId: this.guideWatching.id, userId, username, text, date };
          this._service.deleteComment$(payload).subscribe({
            next: (response) => {
              if (response === 'operation_successful') {
                this.guideWatching.comments.splice(index, 1);
                this._toast.info('Comentario eliminado');
              } else {
                this._toast.error('Error en la operación', 'Error del servidor');
              }
            }
          });
        }
      },
      error: (error) => {
        this._toast.error('Opción no registrada correctamente');
      }
    });
  }

  formatGuideTypes(): string {
    let formatted = '';
    this.guideWatching.guideTypes.forEach(type => formatted += ` ${type},`);
    return formatted.substring(0, formatted.length - 1);
  }

  orderCommentsByNew(): void {
    this.guideWatching.comments = this.guideWatching.comments.sort((a, b) => a.formattedDate.getTime() - b.formattedDate.getTime());
  }

  orderCommentsByOld(): void {
    this.guideWatching.comments = this.guideWatching.comments.sort((a, b) => b.formattedDate.getTime() - a.formattedDate.getTime());
  }

  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  addSaved(guideId: string): void {
    this._service.addSaved$(guideId).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._toast.success('Guía añadida a guardados');
          this.userData.saved.push(guideId);
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
      }
    });
  }

  deleteSaved(guideId: string): void {
    this._service.deleteSaved$(guideId).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._toast.success('Guía eliminada de guardados');
          this.userData.saved = this.userData.saved.filter(guide => guide !== guideId);
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
      }
    });
  }

  findGuideIsSaved(guideId: string): boolean {
    return this.userData.saved.includes(guideId);
  }

}
