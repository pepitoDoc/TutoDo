import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { Guide, GuidePaginationResponse, Rating } from '../../model/data';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { TutodoRoutes } from '../../tutodo.routes';
import { OptionDialogComponent } from '../option-dialog/option-dialog.component';
import { AllUserData, UserData } from '../../model/user-data';

@Component({
  selector: 'tutodo-saved-guides',
  templateUrl: './saved-guides.component.html',
  styleUrl: './saved-guides.component.scss'
})
export class SavedGuidesComponent {

  guidesFound!: Observable<GuidePaginationResponse>;
  currentPage = 0;
  userData!: UserData;

  constructor(
    private readonly _service: ApiService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _sharedService: SharedService,
    private readonly _toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.guidesFound = this._service.findSaved$();
    this.userData = this._route.snapshot.data['userData'];
  }

  visualizeGuide(guideId: string): void {
    this._router.navigate([`../${TutodoRoutes.SEE}/${guideId}`], { relativeTo: this._route });
  }

  editGuideSteps(guideId: string): void {
    this._sharedService.setPersistedData$({ guideIdModifying: guideId }).subscribe({
      next: () => {
        this._router.navigate([`../${TutodoRoutes.MODIFY}`], { relativeTo: this._route });
      },
      error: (error) => {
        // TODO
      }
    });
  }

  editGuideInfo(guideId: string): void {
    this._sharedService.setPersistedData$({ guideIdModifying: guideId }).subscribe({
      next: () => {
        this._router.navigate([`../${TutodoRoutes.MODIFY_INFO}`], { relativeTo: this._route });
      },
      error: (error) => {
        // TODO
      }
    });
  }

  deleteGuide(guideId: string): void {
    this._dialog.open(OptionDialogComponent, {
      width: '400px',
      height: 'auto',
      data: {
        title: '¿Desea eliminar la guía?',
      }
    }).afterClosed().subscribe({
      next: (response) => {
        if (response === true) {
          this._service.deleteGuide$(guideId).subscribe({
            next: (response) => {
              if (response === 'operation_successful') {
                this.guidesFound = this._service.findSaved$(this.currentPage);
                // this.guidesFound = this.guidesFound.filter(guide => guide.id !== guideId);
                this._toast.success('Guía borrada correctamente', 'Operación exitosa')
              } else {
                // TODO
              }
            },
            error: (error) => {
              // TODO
            }
          })
        }
      },
      error: (error) => {
        // TODO
      }
    })
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

  handlePageEvent(e: PageEvent) {
    this.guidesFound = this._service.findOwnGuides$(e.pageIndex);
    this.currentPage = e.pageIndex;
  }

  findGuideIsSaved(guideId: string): boolean {
    return this.userData.saved.includes(guideId);
  }

  addSaved(guideId: string): void {
    this._service.addSaved$(guideId).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._toast.success('Guía añadida a guardados');
          this.userData.saved.push(guideId);
        } else {
          // TODO
        }
      },
      error: (error) => {
        // TODO
      }
    });
  }

  deleteSaved(guideId: string): void {
    this._service.deleteSaved$(guideId).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._toast.success('Guía eliminada de guardados');
          this.userData.saved = this.userData.saved.filter(guide => guide !== guideId);
        }
      },
      error: (error) => {
        // TODO
      }
    });
  }

}
