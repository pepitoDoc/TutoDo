import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { Observable } from 'rxjs';
import { TutodoRoutes } from '../../tutodo.routes';
import { UserPaginationResponse } from '../../model/data';
import { PageEvent } from '@angular/material/paginator';

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
  ) { }

  ngOnInit(): void {
    const username = this._route.snapshot.paramMap.get('username');
    if (username !== null) {
      this.username = username;
      this.usersFound = this._service.findUsers$(username);
    } else {
      // TODO
    }
    this._route.params.subscribe(params => {
      this.username = params['username'];
      this.usersFound = this._service.findUsers$(this.username);
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
