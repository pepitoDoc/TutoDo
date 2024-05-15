import { Component, ElementRef, Inject, LOCALE_ID, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs/internal/Subject';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith, tap } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { R } from '@angular/cdk/keycodes';
import { FindByFilterRequest, Guide, Rating } from '../../model/data';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'tutodo-guide-search',
  templateUrl: './guide-search.component.html',
  styleUrl: './guide-search.component.scss'
})
export class GuideSearchComponent implements OnInit, OnDestroy {

  chosenTypes: string[] = [];
  guideFilter = this._nnfb.group({
    title: ['', [Validators.maxLength(50)]],
    username: ['', [Validators.maxLength(30)]],
    guideTypes: [''],
    rating: ['']
  });
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  filteredTypes!: Observable<string[]>;
  addOnBlur = true;
  readonly _separatorKeysCodes = [] as const;
  guideTypes!: string[];
  ratings: {description: string, value: string}[] = [{description: '1 (Mala)', value: '1'}, {description: '2 (Mejorable)', value: '2'},
  {description: '3 (Bueno)', value: '3'}, {description: '4 (Superior)', value: '4'}, {description: '5 (Excelente)', value: '5'}]
  searchMode = true;
  announcer = inject(LiveAnnouncer);
  guidesFound!: Guide[];
  hasGuides$!: Observable<boolean>;
  formValid = false;

  constructor(
    private readonly _nnfb: NonNullableFormBuilder,
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
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes = this.guideFilter.controls.guideTypes.valueChanges.pipe(
          map((guideType: string) => (guideType ? this._filter(guideType) : this.guideTypes.slice())),
        );
      }
    });
  };

  searchGuide(): void {
    const { title, username, rating } = this.guideFilter.getRawValue();
    const payload: FindByFilterRequest = {
      title: title,
      username: username,
      guideTypes: this.chosenTypes,
      rating: parseInt(rating)
    }
    this._service.findGuideByFilter$(payload).subscribe(response => {
      if (response.length > 0) {
        this.guidesFound = response;
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
    });
  }

  resetSearch(): void {
    this.searchMode = true;
    this.guidesFound = [];
  }

  visualizeGuide(guideId: string): void {
    
  }

  @ViewChild('paginator') paginator!: MatPaginator;
  private unsubscribe = new Subject<void>();

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
      || this.guideFilter.controls.rating.value !== ''
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

}
