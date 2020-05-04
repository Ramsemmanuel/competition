import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';


export interface PasswordResetModel {
  email?: string,
  // token?: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usersDB: AngularFirestoreCollection<any> = this.afs.collection('users');
  uuid = UUID.UUID();
  API_URL: 'http://localhost:3000';

  private emailUrl = 'mails.php';

  constructor(
    public afAuth: AngularFireAuth,
    public afd: AngularFireDatabase,
    private afs: AngularFirestore,
    public snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  loginUser(newEmail: string, newPassword: string) {
    return this.httpClient.post(`http://localhost:3000/login`, {email: newEmail, password: newPassword}).subscribe((data) => {
      let userData = data;
      if(data['code'] === 200) {
        sessionStorage.setItem('competition:uuid', data['data'].id);
        this.router.navigate(data['data'].userType === 'JUDGE' ? ['/submissions'] : ['/profile'] );
        this.snackBar.open('Logged in successfully', 'CLOSE', { duration: 2000 });
      }
      else {
        this.snackBar.open(data['success'], 'CLOSE', { duration: 5000 });
      }
    })
  }

  getLoggedInUser() {
    let userId = sessionStorage.getItem('competition:uuid');
    return this.httpClient.post(`http://localhost:3000/get-user`, {id: userId});
  }

  getUserByEmail(data) {
    return this.httpClient.post(`http://localhost:3000/get-user-by-email`, {email: data});
  }


  updateUser(userData) {
    return this.httpClient.put(`http://localhost:3000/update-user`, userData)
  }

  // resetPassword(email: string): Promise<any> {
  //   return this.afAuth.auth.sendPasswordResetEmail(email);
  // }

  logoutUser() {
    return sessionStorage.removeItem('competition:uuid');
  }

  signupUser(userData) {
    let data = userData;
    data.id = this.uuid;
    data.imageUrl = '';
    data.idDocument = '',
    sessionStorage.setItem('competition:uuid', data.id);
    return this.httpClient.post(`http://localhost:3000/create-user`, userData)
  }

  sendEmailForPasswordReset(message: PasswordResetModel): Observable<PasswordResetModel> | any {
    let mailObj = { email: message }
      return this.httpClient.post(this.emailUrl, mailObj, {responseType: 'text'})
      .pipe(
        map(response => {
          console.log('Sending email was successfull',response);
          return response;
        }),
        catchError(error => {
          console.log('Sending email got error', error);
          return throwError(error)
        })
      );
  }

  resetPassword(userData) {
    return this.httpClient.put(`http://localhost:3000/update-user`, userData)
  }

  currentUser(): any {
    return this.getLoggedInUser()
  }
}
