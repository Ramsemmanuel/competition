import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsersService } from 'src/app/api/users/users.service';
import { Country } from '@angular-material-extensions/select-country';
import { ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/api/auth/auth.service';
import { selectedCountriesData } from 'src/app/data/country-list/selected-countries';

  interface country {
    name: string,
    code: string,
  }

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  form: FormGroup;
  userData: any;

  public countryCtrl: FormControl = new FormControl();
  public countryFilterCtrl: FormControl = new FormControl();

  public countriesData: any[] = selectedCountriesData;
  selectedCountry: any;
  
  constructor(
    public dialogRef: MatDialogRef<UpdateProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private authProvider: AuthService,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      firstName: [this.data ? this.data.firstName : null, Validators.required],
      lastName: [this.data ? this.data.lastName : null, Validators.required],
      dateOfBirth: [this.data ? this.data.dateOfBirth : null],
      email: [this.data ? this.data.email : null, Validators.required],
      cellNumber: [this.data ? this.data.cellNumber : null, Validators.required],
      nationality: [this.data ? this.selectedCountry : null],
      alternateCellNumber: [this.data ? this.data.alternateCellNumber : null]
    });
    this.form.get('nationality').setValue(this.data.nationality);
  }

  

  onCancel(): void {
    this.dialogRef.close();
  }

  updateProfile() {
    this.userData = Object.assign(this.data , this.form.value);
    if(this.userData.id) {
      this.userData.nationality = this.userData.nationality
      this.authProvider.updateUser(this.userData).subscribe((data) => {
        this.snackBar.open(data['message'], 'CLOSE', { duration: 5000 });
        this.dialogRef.close();
      });
    }
  }
}
