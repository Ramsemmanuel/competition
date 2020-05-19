import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  workData: any = {
    artworkDescription: '',
    artworkSize: '',
    artworkMedium: '',
    artworkEditionNo: '',
    imageUrl: '',
    id: ''
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
    this.form = this.formBuilder.group({
      artworkDescription: [this.data.workData ? this.data.workData.artworkDescription : null, Validators.required],
      artworkSize: [this.data.workData ? this.data.workData.artworkSize : null, Validators.required],
      artworkMedium: [this.data.workData ? this.data.workData.artworkMedium : null, Validators.required],
      artworkEditionNo: [this.data.workData ? this.data.workData.artworkEditionNo : null, Validators.required],
    });

    this.workData.imageUrl = this.data.workData ? this.data.workData.imageUrl : null;
    this.workData.id = this.data.workData ? this.data.workData.id : ''
  }

  ngOnInit() {
    this.buttonLabel = 'Upload artwork';
    console.log(this.data);
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
    this.workData.artworkDescription = this.form.value.artworkDescription;
    this.workData.artworkSize = this.form.value.artworkSize;
    this.workData.artworkMedium = this.form.value.artworkMedium;
    this.workData.artworkEditionNo = this.form.value.artworkEditionNo;
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
