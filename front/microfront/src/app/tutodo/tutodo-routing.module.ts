import { NgModule, inject } from '@angular/core';
import { GuardResult, MaybeAsync, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TutodoComponent } from './tutodo.component';
import { TutodoRoutes } from './tutodo.routes';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardService } from './shared/auth.guard.service';
import { FrontPageComponent } from './pages/front-page/front-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MainComponent } from './components/main/main.component';
import { GuideCreateComponent } from './components/guide-create/guide-create.component';
import { GuideModifyComponent } from './components/guide-modify/guide-modify.component';
import { AuthService } from './service/auth.service';
import { Observable } from 'rxjs';
import { MyGuidesComponent } from './components/my-guides/my-guides.component';
import { GuideSearchComponent } from './components/guide-search/guide-search.component';

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
        path: TutodoRoutes.HOME,
        component: HomePageComponent,
        // canActivate: [(): Observable<MaybeAsync<GuardResult>> => inject(AuthService).canActivate()],
        // canActivateChild: [(): Observable<MaybeAsync<GuardResult>> => inject(AuthService).canActivateChild()],
        children: [
          {
            path: '',
            component: MainComponent
          },
          {
            path: TutodoRoutes.CREATE,
            component: GuideCreateComponent
          },
          {
            path: `${TutodoRoutes.MODIFY}`,
            component: GuideCreateComponent
          },
          {
            path: `${TutodoRoutes.MY_GUIDES}`,
            component: MyGuidesComponent
          },
          {
            path: `${TutodoRoutes.SEARCH}`,
            component: GuideSearchComponent
          }
        ]
      },
      {
        path: '**',
        component: FrontPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutodoRoutingModule { }
