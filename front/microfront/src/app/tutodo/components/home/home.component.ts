import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { Observable } from 'rxjs';
import { GuideInfo } from '../../model/data';
import { UserData } from '../../model/user-data';
import { TutodoRoutes } from '../../tutodo.routes';

@Component({
  selector: 'tutodo-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  userData!: UserData;
  newestGuides!: Observable<GuideInfo[]>;
  preferredGuides!: Observable<GuideInfo[]>;
  selectedType!: string;

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _service: ApiService,
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
        window.location.reload();
      }
    });
  }

  deleteSaved(guideId: string): void {
    this._service.deleteSaved$(guideId).subscribe({
      next: (response) => {
        if (response === 'operation_successful') {
          this._toast.success('Guía eliminada de guardados');
          this.userData.saved = this.userData.saved.filter(guide => guide !== guideId);
        } else {
          this._toast.error('Error en la operación', 'Error del servidor');
        }
      },
      error: (error) => {
        this._toast.error('Ha sido redirigido debido a que ha ocurrido un error en el servidor', 'Error del servidor');
        window.location.reload();
      }
    });
  }

  findGuideIsSaved(guideId: string): boolean {
    return this.userData.saved.includes(guideId);
  }

}
