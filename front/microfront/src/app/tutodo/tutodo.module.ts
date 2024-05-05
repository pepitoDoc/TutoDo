import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutodoRoutingModule } from './tutodo-routing.module';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TutodoComponent } from './tutodo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './components/home/home.component';
import { FrontPageComponent } from './pages/front-page/front-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import {MatIconModule} from '@angular/material/icon';
import { GuideCreateComponent } from './components/guide-create/guide-create.component';
import { MainComponent } from './components/main/main.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GuideStepsComponent } from './components/guide-steps/guide-steps.component';



@NgModule({
  declarations: [
    LoginComponent,
    NavbarComponent,
    TutodoComponent,
    HomeComponent,
    FrontPageComponent,
    HomePageComponent,
    GuideCreateComponent,
    MainComponent,
    GuideStepsComponent
  ],
  imports: [
    CommonModule,
    TutodoRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatAutocompleteModule
  ]
})
export class TutodoModule { }
