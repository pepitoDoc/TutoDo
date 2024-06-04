import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddCommentRequest, AddRatingRequest, DeleteCommentRequest, Guide } from '../../model/data';
import { Observable, take } from 'rxjs';
import { UserData } from '../../model/user-data';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { OptionDialogComponent } from '../option-dialog/option-dialog.component';

@Component({
  selector: 'tutodo-guide-see',
  templateUrl: './guide-see.component.html',
  styleUrl: './guide-see.component.scss'
})
export class GuideSeeComponent implements OnInit, AfterViewInit {

  guideWatching!: Guide;
  currentStep = 0;
  ratings: { description: string, punctuation: number }[] = [{ description: '1 (Mala)', punctuation: 1 }, { description: '2 (Mejorable)', punctuation: 2 },
    { description: '3 (Bueno)', punctuation: 3 }, { description: '4 (Superior)', punctuation: 4 }, { description: '5 (Excelente)', punctuation: 5 }];
  comment = this._nnfb.group({
    text: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]]
  });
  userPunctuation!: number;
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
    private _ngZone: NgZone,
    private _cdr: ChangeDetectorRef
  ) {
    this.userData = this._route.snapshot.data['userData'];
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    const guideId = this._route.snapshot.paramMap.get('id');
    if (guideId !== null) {
      this._service.findGuideById$(guideId).subscribe({
        next: (response) => {
          if (response !== null && response !== undefined) {
            this.guideWatching = response;
            this.findUserRating();
            this.orderCommentsByNew();
            if (this.findGuideOwnership()) {
              // TODO deshabilitar estrellitas
              this.comment.disable();
            }
          }
        },
        error: (error) => {
          // TODO
        }
      })
    } else {
      this._toast.info('No se ha podido encontrar la guía seleccionada.', 'No se ha podido acceder a la página');
      this._router.navigate([`../`], { relativeTo: this._route });
    }
  }

  nextStep(): void {
    this.currentStep++;
    this._shared.setPersistedData$({ [this.guideWatching.id]: this.currentStep }).subscribe();
    if (this.currentStep === this.guideWatching.steps.length) {
      this._toast.success('Ahora puede añadir una puntuación a la guía o dejar un comentario.',
        '¡Ha llegado al final de la guía!');
    }
  }

  previousStep(): void {
    this.currentStep--;
    this._shared.setPersistedData$({[this.guideWatching.id]: this.currentStep}).subscribe();
  }

  findUserRating(): boolean {
    const userRating = this.guideWatching.ratings.find(rating => rating.userId === this.userData.id);
    if (userRating !== undefined) {
      if (this.userPunctuation === undefined) {
        this.userPunctuation = userRating.punctuation;
      }
      return true;
    } else {
      this.userPunctuation = 3;
      return false;
    }
  }

  findGuideOwnership(): boolean {
    return this.userData.created.includes(this.guideWatching.id);
  }

  submitRating(punctuation: number): void {
    // TODO añadir lógica no puntuar guia propia
    const payload: AddRatingRequest = {
      guideId: this.guideWatching.id,
      punctuation: punctuation
    }
    this._service.submitRating$(payload).subscribe({
      next: (response) => {
        if (response === 'guide_updated') {
          // this.guideWatching.ratings.push(
          //   { userId: this.userData.id, punctuation: punctuation });
          this.userPunctuation = punctuation;
          this._toast.clear();
          this._toast.success('¡Gracias por puntuar la guía!', 'Puntuación registrada');
        } else {
          // TODO
        }
      },
      error: (error) => {
        // TODO
      }
    });
  }

  submitComment(): void {
    const payload: AddCommentRequest = {
      guideId: this.guideWatching.id,
      comment: this.comment.controls.text.value
    }
    this._service.submitComment$(payload).subscribe({
      next: (response) => {
        if (response.result === 'operation_successful') {
          this.guideWatching.comments.push(response.comment);
          this.comment.reset();
          this.comment.controls.text.setErrors(null);
          this._toast.success('Su comentario se ha publicado correctamente', 'Comentario publicado')
        }
      },
      error: (error) => {
        // TODO
      }
    })
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
              }
            }
          });
        }
      },
      error: (error) => {
        // TODO
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

}
