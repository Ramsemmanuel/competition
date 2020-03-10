import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/api/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedInUser: any;
  loadingUser: boolean;
  toggleMenu: boolean = false;

  @Input() profileName: any;
  constructor(
    public snackBar: MatSnackBar,
    public authData: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.toggleMenu = false;
    this.authData.logoutUser()
    this.router.navigate(['/login']);
    this.snackBar.open('You have been logged out', 'CLOSE', {
      duration: 5000,
    });
    this.loggedInUser = null;
  }
}
