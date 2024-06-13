import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map } from 'rxjs';
import { FindByFilterRequest, FindByFilterResponse, Rating } from '../../model/data';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { TutodoRoutes } from '../../tutodo.routes';
import { UserData } from '../../model/user-data';

@Component({
  selector: 'tutodo-guide-search',
  templateUrl: './guide-search.component.html',
  styleUrl: './guide-search.component.scss'
})
export class GuideSearchComponent implements OnInit {

  chosenTypes: string[] = [];
  guideFilter = this._nnfb.group({
    title: ['', [Validators.maxLength(100)]],
    username: ['', [Validators.maxLength(100)]],
    guideTypes: [''],
    rating: [0]
  });
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('paginator') paginator!: MatPaginator;
  filteredTypes!: Observable<string[]>;
  addOnBlur = true;
  readonly _separatorKeysCodes = [] as const;
  guideTypes!: string[];
  ratings: {description: string, value: number}[] = [{description: '1 (Mala)', value: 1}, {description: '2 (Mejorable)', value: 2},
  {description: '3 (Bueno)', value: 3}, {description: '4 (Superior)', value: 4}, {description: '5 (Excelente)', value: 5}]
  searchMode = true;
  announcer = inject(LiveAnnouncer);
  findByFilterResponse!: FindByFilterResponse;
  hasGuides$!: Observable<boolean>;
  formValid = false;
  userData!: UserData;
  currentPage = 0;

  constructor(
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _service: ApiService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _toast: ToastrService
  ) { 
    this.userData = this._route.snapshot.data['userData'];
  }

  ngOnInit(): void {
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes = this.guideFilter.controls.guideTypes.valueChanges.pipe(
          map((guideType: string) => (guideType ? this._filter(guideType) : this.guideTypes.slice())),
        );
      }
    });
    let receivedParams = false;
    ['title', 'username', 'rating'].forEach(param => {
      if (this._route.snapshot.paramMap.get(param) !== null) {
        this.guideFilter.get(param)?.setValue(this._route.snapshot.paramMap.get(param));
        receivedParams = true;
      }
    });
    if (this._route.snapshot.paramMap.get('guideType') !== null) {
      this.chosenTypes.push(this._route.snapshot.paramMap.get('guideType')!);
      receivedParams = true;
    }
    if (receivedParams) {
      this.searchGuide();
    }
  };

  searchGuide(): void {
    const { title, username, rating } = this.guideFilter.getRawValue();
    const payload: FindByFilterRequest = {
      title: title,
      username: username,
      guideTypes: this.chosenTypes,
      rating: rating,
      pageNumber: this.currentPage
    }
    this._service.findGuideByFilter$(payload).subscribe({
      next: (response) => {
        if (response !== null  && response.totalGuides > 0) {
          this.findByFilterResponse = response;
          this.searchMode = false;
        } else {
          this._dialog.open(InfoDialogComponent, {
            width: '400px',
            height: 'auto',
            data: {
              title: 'No se han encontrado resultados',
              text: ['No se ha encontrado ninguna guía que cumplan con los criterios del filtro de búsqueda.']
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

  resetSearch(): void {
    this.searchMode = true;
  }

  visualizeGuide(guideId: string): void {
    this._router.navigate([`../${TutodoRoutes.SEE}/${guideId}`], { relativeTo: this._route });
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
 
  remove(guideType: string): void {
    const index = this.chosenTypes.indexOf(guideType);
    if (index >= 0) {
      this.chosenTypes.splice(index, 1);
      this.announcer.announce(`Removed ${guideType}`);
    }
    if (this.chosenTypes.length === 4) this.guideFilter.controls.guideTypes.enable();
    this.guideFilter.controls.guideTypes.reset();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.chosenTypes.push(event.option.viewValue);
    if (this.chosenTypes.length === 5) this.guideFilter.controls.guideTypes.disable();
    this.guideTypeInput.nativeElement.value = '';
    this.guideFilter.controls.guideTypes.reset();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter(guideType => guideType.toLowerCase().includes(filterValue));
  }

  atLeastOneValue(): boolean {
    return this.guideFilter.controls.title.value !== ''
      || this.guideFilter.controls.username.value !== ''
      || this.guideFilter.controls.rating.value !== 0
      || this.chosenTypes.length !== 0;
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
    this.currentPage = e.pageIndex;
    this.searchGuide();
  }

}
