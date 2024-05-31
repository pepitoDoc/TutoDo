import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { TutodoComponent } from './tutodo.component';
import { TutodoRoutes } from './tutodo.routes';
import { HomeComponent } from './components/home/home.component';
import { FrontPageComponent } from './pages/front-page/front-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MainComponent } from './components/main/main.component';
import { GuideCreateComponent } from './components/guide-create/guide-create.component';
import { GuideModifyComponent } from './components/guide-modify/guide-modify.component';
import { AuthService } from './service/auth.service';
import { Observable } from 'rxjs';
import { MyGuidesComponent } from './components/my-guides/my-guides.component';
import { GuideSearchComponent } from './components/guide-search/guide-search.component';
import { GuideSeeComponent } from './components/guide-see/guide-see.component';
import { UserData } from './model/user-data';
import { UserService } from './service/user.service';
import { GuideModifyInfoComponent } from './components/guide-modify-info/guide-modify-info.component';
import { PublishedService } from './service/published.service';

const canActivateGuide: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) => {
  return inject(PublishedService).canActivate(route.params['id']);
}

const routes: Routes = [
  {
    path: TutodoRoutes.ROOT,
    component: TutodoComponent,
    children: [
      {
        path: TutodoRoutes.ROOT,
        redirectTo: TutodoRoutes.LOGIN,
        pathMatch: 'full'
      },
      {
        path: TutodoRoutes.LOGIN,
        component: FrontPageComponent
      },
      {
        path: TutodoRoutes.TUTODO,
        component: HomePageComponent,
        canActivate: [(): Observable<MaybeAsync<GuardResult>> => inject(AuthService).canActivate()],
        canActivateChild: [(): Observable<MaybeAsync<GuardResult>> => inject(AuthService).canActivateChild()],
        children: [
          {
            path: TutodoRoutes.HOME,
            component: HomeComponent
          },
          {
            path: TutodoRoutes.CREATE,
            component: GuideCreateComponent
          },
          {
            path: `${TutodoRoutes.MODIFY}`,
            component: GuideModifyComponent
          },
          {
            path: `${TutodoRoutes.MODIFY_INFO}`,
            component: GuideModifyInfoComponent
          },
          {
            path: `${TutodoRoutes.MY_GUIDES}`,
            component: MyGuidesComponent
          },
          {
            path: `${TutodoRoutes.SEARCH}`,
            component: GuideSearchComponent
          },
          {
            path: `${TutodoRoutes.SEE}/:id`,
            canActivate: [canActivateGuide],
            resolve: { userData: () => inject(UserService).getUserData$() },
            component: GuideSeeComponent
          },
          {
            path: `${TutodoRoutes.SAVED}`,
            component: GuideSearchComponent
          },
          {
            path: `${TutodoRoutes.MAIN}`,
            component: MainComponent
          },
          {
            path: '**', 
            redirectTo: TutodoRoutes.HOME, 
            pathMatch: 'full'
          }
        ]
      },
      {
        path: '**', 
        redirectTo: TutodoRoutes.TUTODO, 
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutodoRoutingModule { }
