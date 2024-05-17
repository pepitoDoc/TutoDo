import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { Guide, Rating } from '../../model/data';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { TutodoRoutes } from '../../tutodo.routes';

@Component({
  selector: 'tutodo-my-guides',
  templateUrl: './my-guides.component.html',
  styleUrl: './my-guides.component.scss'
})
export class MyGuidesComponent implements OnInit {

  guidesFound!: Guide[];

  constructor(
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _service: ApiService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _sharedService: SharedService,
    private readonly _toast: ToastrService
  ) {}

  ngOnInit(): void {
    this._service.findOwnGuides$().subscribe(response => {
      if (response.length === 0) {
        this._dialog.open(InfoDialogComponent, {
          width: '400px',
          height: 'auto',
          data: {
            title: 'No se han encontrado resultados',
            text: ['El usuario no tiene ninguna guía registrada.']
          }
        }).afterClosed().subscribe( () => this._router.navigate([`../`], { relativeTo: this._route }));
      } else {
        this.guidesFound = response;
      }
    });
  }

  visualizeGuide(guideId: string): void {
    
  }

  editGuide(guideId: string): void {
    this._sharedService.setPersistedData$({ guideIdModifying: guideId }).subscribe( 
      () => this._router.navigate([`../${TutodoRoutes.MODIFY}`], { relativeTo: this._route }));
  }

  formatGuideTypes(guideTypes: string[]): string {
    let formatted = '';
    guideTypes.forEach(type => formatted += ` ${type},`);
    return formatted.substring(0, formatted.length - 1);
  }

  ratingMean(ratings: Rating[]): string {
    if (ratings.length > 0) {
      let mean = 0;
      ratings.forEach(rating => mean += rating.punctuation);
      return (Math.round((mean / ratings.length) * 10) / 10).toString();
    } else {
      return "No puntuado";
    }
  }

}
