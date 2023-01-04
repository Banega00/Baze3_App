import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-dialog',
  template: `
    <div class="modal-container">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <div mat-dialog-content>{{ data.message }}</div>
    </div>
  `,
  styleUrls: ['./simple-dialog.component.css']
})
export class SimpleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}