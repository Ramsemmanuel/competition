import { Component, Inject } from '@angular/core';
import { AuthService } from './api/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
    @Inject(DOCUMENT) private document: Document
  ) {
    authData.currentUser().subscribe((data) => {
      this.loadingUser = true;
      if(data.length) {
        // this.emailVerified = data.emailVerified;
        this.loggedInUser = data[0];
        this.loggedInUser.firstName = data[0].userType === 'JUDGE' ? 'JUDGE' :  data[0].firstName; 
        console.log(data);
        this.router.navigate(data[0].userType === 'JUDGE' ? ['/submissions'] : ['/profile'] );
        this.loadingUser = false;
        if(!data) {
         this.router.navigate(['/login']);
          this.loggedInUser = null;
          this.loadingUser = false;
        }
      }
      else {
       this.router.navigate(['/login']);
        this.loggedInUser = null;
        this.loadingUser = false;
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
      this.document.body.classList.remove('auth-page');
      if((event.url.indexOf('login') > -1) || (event.url.indexOf('register') > -1)) {
        this.document.body.classList.add('auth-page');
      }
      else {
        this.document.body.classList.remove('auth-page');
      }
    });
  }

  logout() {
    this.toggleMenu = false;
    this.authData.logoutUser()
    this.loggedInUser = null;
    this.router.navigate(['/login']);
    location.reload();
    this.snackBar.open('You have been logged out', 'CLOSE', {
      duration: 5000,
    });
  }
}
