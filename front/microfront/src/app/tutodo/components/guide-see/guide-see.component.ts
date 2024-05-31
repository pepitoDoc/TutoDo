import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Validators, FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddRatingRequest, Guide } from '../../model/data';
import { Observable } from 'rxjs';
import { UserData } from '../../model/user-data';

@Component({
  selector: 'tutodo-guide-see',
  templateUrl: './guide-see.component.html',
  styleUrl: './guide-see.component.scss'
})
export class GuideSeeComponent implements OnInit, AfterViewInit {

  guideWatching!: Guide;
  currentStep = 0;
  ratings: { description: string, value: number }[] = [{ description: '1 (Mala)', value: 1 }, { description: '2 (Mejorable)', value: 2 },
  { description: '3 (Bueno)', value: 3 }, { description: '4 (Superior)', value: 4 }, { description: '5 (Excelente)', value: 5 }];
  rating = this._nnfb.group({
    punctuation: [1, Validators.required]
  });
  comment = this._nnfb.group({
    text: ['', Validators.required, Validators.minLength(50), Validators.maxLength(500)]
  });
  userData!: UserData;
  
  constructor(
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _service: ApiService,
    private readonly _shared: SharedService,
    private readonly _toast: ToastrService,
    private _zone: NgZone,
    private _cdr: ChangeDetectorRef
  ) {
    this.userData = this._route.snapshot.data['userData'];
  }

  ngAfterViewInit(): void {
    // const guideId = this._route.snapshot.paramMap.get('id');
    // if (guideId !== null) {
    //   this._shared.getPersistedData$(guideId).subscribe({
    //     next: (response) => {
    //       if (typeof response === 'object' && Object.keys(response).length !== 0) {
    //         this._zone.run(() => {
    //           this.currentStep = response;
    //           this._cdr.detectChanges();  // Ensure change detection runs
    //         });
    //       }
    //     } // TODO mirar si se puede hacer con directiva
    //   });
    // }
  }

  ngOnInit(): void {
    const guideId = this._route.snapshot.paramMap.get('id');
    if (guideId !== null) {
      this._service.findGuideById$(guideId).subscribe({
        next: (response) => {
          if (response !== null && response !== undefined) {
            this.guideWatching = response;
            this.findUserRating();
            // this._shared.getPersistedData$(guideId).subscribe({
            //   next: (response) => {
            //     if (typeof response === 'object' && Object.keys(response).length !== 0) {
            //       this._zone.run(() => {
            //         this.currentStep = response;
            //         this._cdr.detectChanges();
            //       });
            //     }
            //   }
            // });
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
      this.rating.controls.punctuation.setValue(userRating.punctuation);
      return true;
    } else {
      return false;
    }
  }

  submitRating(): void {
    const payload: AddRatingRequest = {
      guideId: this.guideWatching.id,
      punctuation: this.rating.controls.punctuation.getRawValue()
    }
    this._service.submitRating$(payload).subscribe({
      next: (response) => {
        if (response === 'guide_updated') {
          this._toast.success('¡Gracias por puntuar la guía!', 'Puntuación registrada');
        } else {
          // TODO
        }
      },
      error: (error) => {
        // TODO
      }
    })
  }

  formatGuideTypes(): string {
    let formatted = '';
    this.guideWatching.guideTypes.forEach(type => formatted += ` ${type},`);
    return formatted.substring(0, formatted.length - 1);
  }

}
