import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutodoRoutingModule } from './tutodo-routing.module';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TutodoComponent } from './tutodo.component';


@NgModule({
  declarations: [
    LoginComponent,
    NavbarComponent,
    TutodoComponent
  ],
  imports: [
    CommonModule,
    TutodoRoutingModule,
    HttpClientModule
  ]
})
export class TutodoModule { }
