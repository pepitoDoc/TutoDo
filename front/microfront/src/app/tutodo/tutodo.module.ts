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



@NgModule({
  declarations: [
    LoginComponent,
    NavbarComponent,
    TutodoComponent,
    HomeComponent,
    FrontPageComponent
  ],
  imports: [
    CommonModule,
    TutodoRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class TutodoModule { }
