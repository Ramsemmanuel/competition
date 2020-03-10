import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  
  downloadURL: Observable<string>;
  imageUrl: any;
  uploadingImage: boolean = false;
  uploadPercent: number;
  @Output() imageUploaded = new EventEmitter<string>();
  @Input() fileDirectory: any;
  @Input() buttonLabel: any;
  @Input() showFileName: boolean;
  fileName: any;

  constructor(
    private storage: AngularFireStorage,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  async uploadFile(event) {
    this.uploadingImage = true;
    const file = event.target.files[0];
    const filePath = `${this.fileDirectory}/images/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    task.percentageChanges().subscribe(number => {
      this.uploadPercent = number;
      this.buttonLabel = this.uploadPercent === 100 ? 'Upload file' : `Uploading ${number.toFixed(0)}%`;
    });

    this.fileName = file.name;

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {

              if(downloadURL){
                this.imageUploaded.emit(downloadURL);
                this.uploadingImage = false;
                this.snackBar.open('Image uploaded successfully', 'CLOSE', {
                  duration: 2000,
                });
              }
          });
        })
    )
    .subscribe();
  
  }

}
