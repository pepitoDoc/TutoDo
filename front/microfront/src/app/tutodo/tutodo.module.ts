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
import { MatIconModule } from '@angular/material/icon';
import { MainComponent } from './components/main/main.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GuideModifyComponent } from './components/guide-modify/guide-modify.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { OptionDialogComponent } from './components/option-dialog/option-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ToastrModule } from 'ngx-toastr';
import { MyGuidesComponent } from './components/my-guides/my-guides.component';
import { GuideSearchComponent } from './components/guide-search/guide-search.component';
import { GuideSeeComponent } from './components/guide-see/guide-see.component';
import { GuideCreateComponent } from './components/guide-create/guide-create.component';


@NgModule({
  declarations: [
    LoginComponent,
    NavbarComponent,
    TutodoComponent,
    HomeComponent,
    FrontPageComponent,
    HomePageComponent,
    GuideModifyComponent,
    GuideModifyComponent,
    GuideSearchComponent,
    GuideSeeComponent,
    GuideCreateComponent,
    MainComponent,
    InfoDialogComponent,
    OptionDialogComponent,
    MyGuidesComponent
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
    MatAutocompleteModule,
    MatPaginatorModule,
    MatDialogModule,
    MatStepperModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSnackBarModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right'
    })
  ]
})
export class TutodoModule { }
