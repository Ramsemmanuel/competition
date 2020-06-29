import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-logout-dialog',
  templateUrl: './confirm-logout-dialog.component.html',
  styleUrls: ['./confirm-logout-dialog.component.scss']
})
export class ConfirmLogoutDialogComponent implements OnInit {

  competitionTypes: any;
  constructor(
    public dialogRef: MatDialogRef<ConfirmLogoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    
    onCancel(): void {
      this.dialogRef.close(false);
    }

    onConfirm(): void {
      this.dialogRef.close(true);
    }

    ngOnInit() {
    }

}
