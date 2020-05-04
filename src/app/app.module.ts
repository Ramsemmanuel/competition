import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/auth/login/login.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { AuthService } from './api/auth/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { MaterialModule } from './modules/material.designs';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { FileUploaderComponent } from './components/reusable/file-uploader/file-uploader.component';
import { UsersService } from './api/users/users.service';
import { CompetitionsService } from './api/competitions/competitions.service';
import { UpdateProfileComponent } from './pages/profile/update-profile/update-profile.component';
import { EnterCompetitionComponent } from './pages/competition/enter-competition/enter-competition.component';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { AddWorkComponent } from './pages/competition/add-work/add-work.component';
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import { ConfirmDialogService } from './providers/modals/confirm-dialog.service';
import { IdGeneratorService } from './providers/id-generator/id-generator.service';
import { SubmissionComponent } from './pages/submission/submission.component';
import { PasswordResetComponent } from './pages/auth/password-reset/password-reset.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    RegisterComponent,
    FileUploaderComponent,
    UpdateProfileComponent,
    EnterCompetitionComponent,
    AddWorkComponent,
    ConfirmDeleteDialogComponent,
    SubmissionComponent,
    PasswordResetComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,

    MaterialModule,

    MatSelectCountryModule,
  ],
  providers: [
    AngularFirestore,
    AuthService,
    UsersService,
    CompetitionsService,
    AngularFireDatabase,
    ConfirmDialogService,
    IdGeneratorService
  ],
  entryComponents: [
    UpdateProfileComponent,
    EnterCompetitionComponent,
    AddWorkComponent,
    ConfirmDeleteDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
