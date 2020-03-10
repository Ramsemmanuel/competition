import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { EnterCompetitionComponent } from '../enter-competition/enter-competition.component';
import { UsersService } from 'src/app/api/users/users.service';
import { CompetitionsService } from 'src/app/api/competitions/competitions.service';
import { IdGeneratorService } from 'src/app/providers/id-generator/id-generator.service';

@Component({
  selector: 'app-add-work',
  templateUrl: './add-work.component.html',
  styleUrls: ['./add-work.component.scss']
})
export class AddWorkComponent implements OnInit {

  form: FormGroup;
  userData: any;
  buttonLabel: any;
  artworkDescription: string = '';
  workData: any = {
    artworkDescription: '',
    imageUrl: ''
  };
  imageUrl: any;
  userId = sessionStorage.getItem('competition:uuid');
  
  constructor(
    public dialogRef: MatDialogRef<EnterCompetitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userProvider: UsersService,
    private competitionProviders: CompetitionsService,
    private idGeneratorProvider: IdGeneratorService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.buttonLabel = 'Upload artwork'
    this.artworkDescription = this.data.workData ? this.data.workData.artworkDescription : '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onImageUploaded(url) {
    this.workData.imageUrl = url;
  }

  addWork() {
    // this.workData = Object.assign(this.data.workData , this.form.value);
    this.workData.userId = this.userId;
    this.workData.artworkDescription = this.artworkDescription;
    if(this.workData.id) {
      // this.workData.imageUrl = this.workData.imageUrl ? this.workData.imageUrl : this.data.workData.imageUrl;
      this.competitionProviders.updateWork(this.workData).subscribe((data) => {
      });
    }
    else {
      this.workData.id = this.idGeneratorProvider.generateId();
      this.workData.dateAdded = Date.now();
      this.competitionProviders.addArtworkWork(this.workData).subscribe((data) => {
        this.snackBar.open('Work added successfully', 'CLOSE', { duration: 5000 });
      });
    }
    this.dialogRef.close();
  }

}
