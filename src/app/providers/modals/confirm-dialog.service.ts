import { Injectable } from '@angular/core';
import { ConfirmDeleteDialogComponent } from 'src/app/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  dialogRef: any;
  constructor(public dialog: MatDialog) { }

  openDialog(action, type, data) {
    return this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '500px',
      data: { name: data.description, type: type, action: action }
    });
  }

  openConfirmDialog(action, type, data) {
    this.dialogRef = this.openDialog(action, type, data);

    return this.dialogRef.afterClosed()
  }
}
