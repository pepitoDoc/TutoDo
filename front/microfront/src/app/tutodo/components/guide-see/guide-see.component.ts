import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Guide } from '../../model/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'tutodo-guide-see',
  templateUrl: './guide-see.component.html',
  styleUrl: './guide-see.component.scss'
})
export class GuideSeeComponent implements OnInit {

  guideWatching!: Guide;
  currentStep = 0;
  
  constructor(
    private readonly nnfb: NonNullableFormBuilder,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _service: ApiService,
    private readonly _shared: SharedService,
    private readonly _toast: ToastrService
  ) {}

  ngOnInit(): void {
    const guideId = this._route.snapshot.paramMap.get('id');
    if (guideId !== null) {
      this._service.findGuideById$(guideId).subscribe({
        next: (response) => {
          if (response !== null && response !== undefined) {
            this.guideWatching = response;
          }
        }
      })
    } else {
      this._toast.info('No se ha podido encontrar la guía seleccionada.', 'No se ha podido acceder a la página');
      this._router.navigate([`../`], { relativeTo: this._route });
    }
  }

  nextStep(): void {
    this.currentStep++;
  }

  previousStep(): void {
    this.currentStep--;
  }

}
