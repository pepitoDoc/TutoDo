import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { SharedService } from '../../shared/shared.service';
import { Observable } from 'rxjs';
import { Guide } from '../../model/data';
import { AllUserData, UserData } from '../../model/user-data';

@Component({
  selector: 'tutodo-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  userData!: UserData;
  newestGuides!: Observable<Guide[]>;
  preferredGuides!: Observable<Guide[]>;
  selectedType!: string;

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _service: ApiService,
    private readonly _shared: SharedService,
    private readonly _toast: ToastrService
  ) {
    this.userData = this._route.snapshot.data['userData'];
    if(this.userData.preferences.length > 0) this.selectedType = this.userData.preferences[0];
  }

  ngOnInit(): void {
    this.newestGuides = this._service.findNewestGuides$();
    if (this.userData.preferences.length > 0) 
      this.preferredGuides = this._service.findNewestGuidesByPreference$(this.userData.preferences[0]);
  }

  findNewestGuidesByPreference(type: string): void {
    this.preferredGuides = this._service.findNewestGuidesByPreference$(type);
  }

  onTypeChange(selectedType: string): void {
    this.selectedType = selectedType;
  }

}
