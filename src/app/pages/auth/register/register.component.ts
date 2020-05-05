import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/api/auth/auth.service';
import { Router } from '@angular/router';
import { Country } from '@angular-material-extensions/select-country';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  loading: boolean = false;
  form: FormGroup;
  
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      cellNumber: ['', Validators.required],
      terms: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  onCountrySelected($event: Country) {
    // console.log($event);
  }

  passwordMatch() {
    return this.form.value.password == this.form.value.confirmPassword;
  }

  registerUser() {
      if(this.form.value.password == this.form.value.confirmPassword) {
        this.loading = true;
        this.authService.signupUser(this.form.value)
        .subscribe(authData => {
          this.router.navigate(['/profile']);
          this.loading = false;
        }, error => {
          this.snackBar.open(error.message, 'CLOSE', { duration: 1000000 });
          this.loading = false;
        });
      }
      else {
        this.loading = false;
        this.snackBar.open('Form is not valid', 'CLOSE', { duration: 2000 });
      }
    }

}
