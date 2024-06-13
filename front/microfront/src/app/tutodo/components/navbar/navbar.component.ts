import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TutodoRoutes } from '../../tutodo.routes';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserData } from '../../model/user-data';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'tutodo-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  userData!: UserData;
  userInfo = this._nnfb.group({
    username: ['', [Validators.required, Validators.maxLength(100)]]
  });

  constructor(
    private readonly _service: ApiService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _toast: ToastrService,
    private readonly _nnfb: NonNullableFormBuilder
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
        this._toast.error('Error en la operación', 'Error del servidor');
      }
    });
  }

  searchUser(): void {
    this._router.navigate([`/${TutodoRoutes.TUTODO}/${TutodoRoutes.SEARCH_USER}/${this.userInfo.controls.username.value}`]);
  }

}
