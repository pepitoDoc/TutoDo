import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tutodo-option-dialog',
  templateUrl: './option-dialog.component.html',
  styleUrl: './option-dialog.component.scss'
})
export class OptionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string[]; }
  ) { }

}
