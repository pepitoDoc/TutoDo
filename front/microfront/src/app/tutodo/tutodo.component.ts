import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tutodo',
  templateUrl: './tutodo.component.html',
  styleUrl: './tutodo.component.scss'
})
export class TutodoComponent {

  constructor(
    private readonly route: ActivatedRoute
  ) { }

  showNavbar(): boolean {
    const url: string = '/' + this.route.pathFromRoot
      .map(route => route.snapshot.url)
      .filter(urlSegments => !!urlSegments[0])
      .map(([urlSegment]) => urlSegment.path)
      .join('/');
    return url.includes('login') ? true : false;
  }

}
