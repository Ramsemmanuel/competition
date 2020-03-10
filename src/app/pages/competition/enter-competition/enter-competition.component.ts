import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/api/users/users.service';
import { CompetitionsService } from 'src/app/api/competitions/competitions.service';

@Component({
  selector: 'app-enter-competition',
  templateUrl: './enter-competition.component.html',
  styleUrls: ['./enter-competition.component.scss']
})
export class EnterCompetitionComponent implements OnInit {
  form: FormGroup;
  userData: any = {competitions: ''};
  buttonLabel: any;
  artworkDescription: string = '';
  competitionEntry: any
  imageUrl: any;
  
  constructor(
    public dialogRef: MatDialogRef<EnterCompetitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userProvider: UsersService,
    private competitionProviders: CompetitionsService,
  ) {
    this.form = this.formBuilder.group({
    })
  }

  ngOnInit() {
    this.buttonLabel = 'Upload artwork'
    console.log(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onImageUploaded(url) {
    this.competitionEntry.imageUrl = url;
  }

  enterCompetition() {
    this.competitionEntry.competitionId = this.data.competition.id;
    this.competitionEntry.userId = this.data.userData.id;
    this.competitionEntry.entryDate = Date.now();
    this.competitionEntry.artworkDescription = this.artworkDescription;
    this.competitionProviders.enterCompetition(this.competitionEntry);
    this.userData = this.data.userData;


    this.userData.competitions = this.competitionEntry.competitionId ? [this.competitionEntry.competitionId] : [];
    this.userProvider.updateUser(this.userData);
    this.dialogRef.close();
  }
}