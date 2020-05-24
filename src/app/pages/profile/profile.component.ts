import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AuthService } from 'src/app/api/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/api/users/users.service';
import { CompetitionsService } from 'src/app/api/competitions/competitions.service';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { EnterCompetitionComponent } from '../competition/enter-competition/enter-competition.component';
import { AddWorkComponent } from '../competition/add-work/add-work.component';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ConfirmDialogService } from 'src/app/providers/modals/confirm-dialog.service';
import { IdGeneratorService } from 'src/app/providers/id-generator/id-generator.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: any;
  imageUrl: any;
  buttonLabel: string;
  competitionsData: any;
  userWorkData: any;
  loadingWorkData: boolean = true;
  toggleEdit: boolean = false;
  form: FormGroup;
  userId = sessionStorage.getItem('competition:uuid');
  userArtworkEntriesData: any;

  constructor(
    public snackBar: MatSnackBar,
    public authProvider: AuthService,
    public usersProvider: UsersService,
    public competitionsProvider: CompetitionsService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private confirmDialog: ConfirmDialogService,
    private idGeneratorProvider: IdGeneratorService,
  ) {
    this.form = this.formBuilder.group({
      bio: [this.userData ? this.userData.bio : null, Validators.required],
    });
  }

  ngOnInit() {
    this.buttonLabel = 'Upload image';

    this.competitionsProvider.getCompetitions().valueChanges().subscribe((data)=> {
      this.competitionsData = data;
    });
    this.getUser();
  }

  getUserArtworkSubmitted(work) {
    return this.userArtworkEntriesData.find(item => item.artworkId === work.id);
  }

  getUser() {
    this.authProvider.getLoggedInUser().subscribe((data)=> {
      this.userData = data[0];
      if(data[0]) {
      this.getUserWork();
        this.form.patchValue({bio: this.userData.bio ? this.userData.bio : '' });
      }
      else {
        this.router.navigate(['/login']);
      }
    });
    this.competitionsProvider.getUserArtworkEntry().subscribe((data) => {
      this.userArtworkEntriesData = data;
    })
  }

  getUserWork() {
    this.loadingWorkData = true;
    this.competitionsProvider.getUserWork(this.userData.id).subscribe((data) => {
        this.userWorkData = data;
        this.loadingWorkData = false;
    });
  }

  callUserUpdate(userData) {
    this.authProvider.updateUser(userData).subscribe(data => {
      this.snackBar.open(data['message'], 'CLOSE', { duration: 5000 });
      this.toggleEdit = false;
      this.getUser();
    });
  }

  saveBio() {
    this.userData.bio = this.form.value.bio;
    if(this.userData.id) {
      this.callUserUpdate(this.userData);
    }
  }

  onImageUploaded(url) {
    this.userData.imageUrl = url;
    this.callUserUpdate(this.userData);
  }

  onIdUploaded(url) {
    this.userData.idDocument = url;
    this.callUserUpdate(this.userData);
  }

  removeDocument() {
    this.userData.idDocument = null;
    this.callUserUpdate(this.userData);
  }

  editProfile(item) {
    this.dialog.open(UpdateProfileComponent, {
      width: '600px',
      data: item
    }).afterClosed().subscribe((data)=> {
      this.getUser();
    });
  }

  enterCompetition(item) {
    this.dialog.open(EnterCompetitionComponent, {
      width: '600px',
      data: {competition: item, userData: this.userData}
    });
  }


  addWork() {
    this.dialog.open(AddWorkComponent, {
      width: '600px',
      data: {workData: null, userData: this.userData}
    }).afterClosed().subscribe((data)=> {
      this.getUserWork();
    });
  }

  submitEntry(item) {
    let entryData = item;
    this.confirmDialog.openConfirmDialog('submit', 'work', item).subscribe(res => {
      if(res) {
        entryData.entryDate = Date.now();
        entryData.artworkId = item.id;
        entryData.id = this.idGeneratorProvider.generateId();
        this.competitionsProvider.enterCompetition(entryData).subscribe((data) => {
          this.snackBar.open('Entry sumitted successfully', 'CLOSE', { duration: 5000 });
          this.getUserWork();
          this.getUser()
        })
      }
    })
  }


  editWork(item) {
    this.dialog.open(AddWorkComponent, {
      width: '600px',
      data: {workData: item, userData: this.userData}
    }).afterClosed().subscribe((data)=> {
      this.getUserWork();
    });
  }

  onDeleteWork(item) {
    this.confirmDialog.openConfirmDialog('delete', 'work', item).subscribe(res => {
      if(res) {
        this.competitionsProvider.deleteWork(item).subscribe((data) => {
          this.snackBar.open(data['message'], 'CLOSE', { duration: 5000 });
          this.getUserWork();
        })
      }
    })
  }
}
