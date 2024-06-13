import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { Observable } from 'rxjs';
import { TutodoRoutes } from '../../tutodo.routes';
import { UserPaginationResponse } from '../../model/data';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tutodo-search-user',
  templateUrl: './search-user.component.html',
  styleUrl: './search-user.component.scss'
})
export class SearchUserComponent implements OnInit {

  username!: string;
  usersFound!: Observable<UserPaginationResponse>;
  currentPage = 0;

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _service: ApiService,
    private readonly _toast: ToastrService
  ) { }

  ngOnInit(): void {
    const username = this._route.snapshot.paramMap.get('username');
    if (username !== null) {
      this.username = username;
      this.usersFound = this._service.findUsers$(username);
    } else {
      this._toast.error('No se ha podido recibir el nombre de usuario de la búsqueda', 'Error de búsqueda');
      this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
    }
    this._route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
        this.usersFound = this._service.findUsers$(this.username);
      } else {
        this._toast.error('No se ha podido recibir el nombre de usuario de la búsqueda', 'Error de búsqueda');
        this._router.navigate([`/${TutodoRoutes.TUTODO}`]);
      }
    });
  }

  findUserGuidesByPreference(preference: string): void {
    this._router.navigate([`../../${TutodoRoutes.SEARCH}`, { username: this.username, guideType: preference }], { relativeTo: this._route });
  }

  findUserGuides(): void {
    this._router.navigate([`../../${TutodoRoutes.SEARCH}`, { username: this.username }], { relativeTo: this._route });
  }

  handlePageEvent(e: PageEvent) {
    this.usersFound = this._service.findUsers$(this.username, e.pageIndex);
    this.currentPage = e.pageIndex;
  }

}
