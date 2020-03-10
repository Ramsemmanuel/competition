import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/api/auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loading: boolean = false;
  form: FormGroup;
  isResetPassword: boolean;
  
  constructor(
    public authData: AuthService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router
  ) { 
    this.form = this.formBuilder.group({
      email: ['ritshidze@me.com', [Validators.required, Validators.email]],
      password: ['123456', this.isResetPassword  ? Validators.nullValidator : Validators.required]
    })
  }

  ngOnInit() {
  }

  toggleResetPassword() {
    this.isResetPassword = !this.isResetPassword;

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isResetPassword  ? Validators.nullValidator : Validators.required]
    })
  }

  loginUser() {
    this.authData.loginUser(this.form.value.email, this.form.value.password);
  }

    resetPassword() {
      this.authData.resetPassword(this.form.value.email).then(data => {
        this.toggleResetPassword();
        this.snackBar.open(`A link to reset password was sent to ${ this.form.value.email }, please check it`, 'CLOSE', { duration: 5000 });
      });
    }

}
