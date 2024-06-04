import { Component } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserData } from '../../model/user-data';

@Component({
  selector: 'tutodo-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  userData!: UserData;

  constructor(
    private readonly _shared: SharedService,
    private readonly _service: ApiService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _toast: ToastrService
  ) { 
    this.userData = this._route.snapshot.data['userData'];
  }

  logout(): void {
    this._service.logout$().subscribe({
      next: () => {
        this._toast.success('Se ha salido de la sesión que tenía activa.', 'Sesión terminada');
        this._router.navigate([`/${TutodoRoutes.LOGIN}`]);
      },
      error: (error) => {
        // TODO
      }
    })
  }

}
