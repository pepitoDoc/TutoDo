import { Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from '../../service/api.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { CreateGuideRequest } from '../../model/data';
import { Router, ActivatedRoute } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'tutodo-guide-create',
  templateUrl: './guide-create.component.html',
  styleUrl: './guide-create.component.scss'
})
export class GuideCreateComponent implements OnInit {

  guideInfo: FormGroup = this._fb.group({
    title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(40), Validators.maxLength(100)]],
    guideTypes: ['']
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  filteredTypes!: Observable<string[]>;
  addOnBlur = true;
  readonly _separatorKeysCodes = [] as const;
  guideTypes!: string[];
  chosenTypes: string[] = [];
  announcer = inject(LiveAnnouncer);

  constructor(
    private _ngZone: NgZone,
    private readonly _service: ApiService,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes = this.guideInfo.get('guideTypes')!.valueChanges.pipe(
          startWith(null),
          map((guideType: string | null) => (guideType ? this._filter(guideType) : this.guideTypes.slice())),
        );
      }
    });
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  remove(guideType: string): void {
    const index = this.chosenTypes.indexOf(guideType);
    if (index >= 0) {
      this.chosenTypes.splice(index, 1);
      this.announcer.announce(`Removed ${guideType}`);
    }
    this.guideTypes.push(guideType);
    this.guideInfo.get('guideTypes')?.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.chosenTypes.push(event.option.viewValue);
    this.guideTypeInput.nativeElement.value = '';
    this.guideInfo.get('guideTypes')?.setValue(null);
  }

  guideCreate(): void {
    const payload: CreateGuideRequest = this.guideInfo.getRawValue();
    payload.guideTypes = this.chosenTypes;
    this._service.createGuide$(payload).subscribe({
      next: (response) => {
        if (response.includes('guides_updated')) {
          const guideId: string = response.slice(response.indexOf('?id=') + 4)
          this._sharedService.setData({ guideId });
          this._router.navigate([`../${TutodoRoutes.STEPS}`], { relativeTo: this._route })
        } else {
          
        }
      },
      error: (err) => {
        console.log("ABRIR DIALOG ERROR" + err);
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter(guideType => guideType.toLowerCase().includes(filterValue));
  }

}
