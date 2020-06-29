import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './api/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DOCUMENT, Location, NgLocalization } from '@angular/common';
import { ConfirmDialogService } from './providers/modals/confirm-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'competition';
  toggleMenu: boolean = false;

  loggedInUser: any;
  loadingUser: boolean;
  emailVerified: boolean;

  constructor(
    public snackBar: MatSnackBar,
    public authData: AuthService,
    private router: Router,
    private route:ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    @Inject(DOCUMENT) private document: Document
  ) {

    this.loadUserData();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.loadUserData();
      this.document.body.classList.remove('auth-page');
      if((event.url.indexOf('login') > -1) || (event.url.indexOf('register') > -1) || (event.url.indexOf('password-reset') > -1)) {
        if(event.url.indexOf('login') > -1 || (event.url.indexOf('password-reset') > -1)) {
          this.document.body.classList.add('login-page');
          // this.loggedInUser = null;
        }
        else {
          this.document.body.classList.remove('login-page');
        }
        this.document.body.classList.add('auth-page');
      }
      else {
        this.document.body.classList.remove('auth-page');
        this.document.body.classList.remove('login-page');
      }
    });
  }

  ngOnInit() {

  }

  loadUserData() {
    this.authData.currentUser().subscribe((data) => {
      this.loadingUser = true;
      if(data.length) {
        // this.emailVerified = data.emailVerified;
        this.loggedInUser = data[0];
        //this.loggedInUser.firstName = data[0].userType === 'JUDGE' ? 'JUDGE' :  data[0].firstName; 
        this.loggedInUser.firstName = data[0].firstName; 
        this.loggedInUser.lastName = data[0].lastName; 
        this.router.navigate(data[0].userType === 'JUDGE' ? ['/submissions'] : ['/profile'] );
        this.loadingUser = false;
        if(!data) {
         this.router.navigate(['/login']);
          this.loggedInUser = null;
          this.loadingUser = false;
        }
      }
      else {
      //  this.router.navigate(['/login']);
        this.loggedInUser = null;
        this.loadingUser = false;
      }
    });
  }

  logout() {
    this.confirmDialog.openConfirmDialog('Logout', 'logout', "testtest").subscribe(res => {
      if(res) {
        this.toggleMenu = false;
        this.authData.logoutUser()
        this.loggedInUser = null;
        this.router.navigate(['/login']);
        this.loadUserData();
        this.snackBar.open('You have been logged out', 'CLOSE', {
          duration: 5000,
        });
      }
    });
  }
}
