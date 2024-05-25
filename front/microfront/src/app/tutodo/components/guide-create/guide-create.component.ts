import {
  Component,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { COMMA, ENTER, T } from '@angular/cdk/keycodes';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { MatChipEditedEvent, MatChipGrid, MatChipInputEvent, MatChipRow } from '@angular/material/chips';
import { ApiService } from '../../service/api.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { CreateGuideRequest, UploadImage } from '../../model/data';
import { Router, ActivatedRoute } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'tutodo-guide-create',
  templateUrl: './guide-create.component.html',
  styleUrl: './guide-create.component.scss',
})
export class GuideCreateComponent implements OnInit {
  guideInfo = this._nnfb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(40),
        Validators.maxLength(200),
      ],
    ],
    guideTypes: [''],
    ingredients: [''],
  });
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('guideTypeInput') guideTypeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ingredientsInput')
  ingredientsInput!: ElementRef<HTMLInputElement>;
  filteredTypes!: Observable<string[]>;
  addOnBlur = true;
  readonly separatorKeysCodesTypes = [] as const;
  readonly separatorKeysCodesIngredients = [ENTER, COMMA] as const;
  guideTypes!: string[];
  ingredients: string[] = [];
  chosenTypes: string[] = [];
  announcer = inject(LiveAnnouncer);
  selectedFile!: File;

  constructor(
    private _ngZone: NgZone,
    private readonly _service: ApiService,
    private readonly _nnfb: NonNullableFormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this._service.findAllGuideTypes$().subscribe({
      next: (response) => {
        this.guideTypes = response;
        this.filteredTypes =
          this.guideInfo.controls.guideTypes.valueChanges.pipe(
            map((guideType: string) =>
              guideType !== ''
                ? this._filter(guideType)
                : this.guideTypes.slice()
            )
          );
      },
    });
  }

  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  removeType(guideType: string): void {
    const index = this.chosenTypes.indexOf(guideType);
    if (index >= 0) {
      this.chosenTypes.splice(index, 1);
      this.announcer.announce(`Removed ${guideType}`);
    }
    if (this.chosenTypes.length === 4) {
      this.guideInfo.controls.guideTypes.enable();
      this.guideTypeInput.nativeElement.disabled = false;
    }
    this.guideInfo.controls.guideTypes.reset();
  }

  selectedType(event: MatAutocompleteSelectedEvent): void {
    this.chosenTypes.push(event.option.viewValue);
    if (this.chosenTypes.length === 5) {
      this.guideInfo.controls.guideTypes.disable();
      this.guideTypeInput.nativeElement.disabled = true;
    }
    this.guideTypeInput.nativeElement.value = '';
    this.guideInfo.controls.guideTypes.reset();
  }

  removeIngredient(ingredient: string): void {
    const index = this.ingredients.indexOf(ingredient);
    if (index >= 0) {
      this.ingredients.splice(index, 1);
      this.announcer.announce(`Removed ${ingredient}`);
    }
  }

  addIngredient(ingredient: MatChipInputEvent): void {
    const value = (ingredient.value || '').trim();
    if (value) {
      this.ingredients.push(value);
    }
    ingredient.chipInput!.clear();
  }

  editIngredient(ingredient: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.removeIngredient(ingredient);
      return;
    }
    const index = this.ingredients.indexOf(ingredient);
    if (index >= 0) {
      this.ingredients[index] = value;
    }
  }

  guideCreate(): void {
    const { title, description } = { ...this.guideInfo.getRawValue() };
    const formData = new FormData();
    formData.append('guideThumbnail', this.selectedFile);
    const createGuideRequest: CreateGuideRequest = {
      title: title,
      description: description,
      guideTypes: this.chosenTypes,
      ingredients: this.ingredients
    };
    formData.append('createGuideRequest', new Blob([JSON.stringify(createGuideRequest)], {
      type: 'application/json',
    }));
    this._service.createGuide$(formData).subscribe({
      next: (response) => {
        if (response.includes('creating_updated')) {
          const guideIdModifying: string = response.slice(
            response.indexOf('?id=') + 4
          );
          this._sharedService.setData({ guideIdModifying });
          this._router.navigate([`../${TutodoRoutes.MODIFY}`], {
            relativeTo: this._route,
          });
        } else {
        }
      },
      error: (err) => {
        console.log('ABRIR DIALOG ERROR' + err);
      },
    });
  }

  onFileChanged(event: any): void {
    this.selectedFile = event.target?.files.item(0);
  }

  uploadFile(): void {
    const { title, description } = { ...this.guideInfo.getRawValue() };
    const formData = new FormData();
    formData.append('image', this.selectedFile);
    const payload: UploadImage = {
      title: title,
      description: description,
      guideTypes: this.chosenTypes,
      ingredients: this.ingredients,
    };
    formData.append(
      'uploadImage',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      })
    );
    this._service.uploadImage$(formData).subscribe({
      next: (response) => {
        console.log(response);
      },
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.guideTypes.filter((guideType) =>
      guideType.toLowerCase().includes(filterValue)
    );
  }
}
