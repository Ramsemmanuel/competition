import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/api/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  emailParam: any;
  userDetails: any = { password: '' };
  constructor(
    public authData: AuthService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
    this.route.params.subscribe((params: Params) => this.emailParam = params['email']);
  }

  ngOnInit() {
    this.authData.getUserByEmail(this.emailParam).subscribe((data) => {
      if(data) {
        this.userDetails = data[0];
      }
      else {
        this.userDetails = null;
      }
    })
  }

  passwordMatch = () => this.form.value.password == this.form.value.confirmPassword;

  changePassword() {
    this.loading = true;
    if(this.passwordMatch() && this.userDetails) {
      this.userDetails.password = this.form.value.password;
      this.authData.resetPassword(this.userDetails).subscribe((data)=> {
        this.loading = false;
        this.snackBar.open(`Password changed successfully`, 'CLOSE', { duration: 5000 });
        this.router.navigate(['/login']);
      });
    }

  }

}
