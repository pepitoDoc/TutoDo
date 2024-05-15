import { Component } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';

@Component({
  selector: 'tutodo-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    private readonly _service: SharedService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) { }

  goToCreate(): void {
    this._service.removePersistedData$('guideModifyId').subscribe( () => {
      this._service.setPersistedData$({ createMode: true }).subscribe( () => {
        this._router.navigate([`./${TutodoRoutes.CREATE}`], { relativeTo: this._route });
      });
    });
  }

}
