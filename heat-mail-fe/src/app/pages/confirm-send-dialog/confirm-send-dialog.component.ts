import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-send-dialog',
  // templateUrl: './confirm-send-dialog.component.html',
  styleUrl: './confirm-send-dialog.component.css',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    CommonModule
  ],
  template: `
  <h2 mat-dialog-title>{{ data.title }}</h2>
  <mat-dialog-content>
    {{ data.message }}
    <p *ngIf="data.count > 0">Number of emails to send: <span class="count-highlight">{{ data.count }}</span></p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button *ngIf="data.count > 0" class="send-mails-button" mat-button [mat-dialog-close]="false">Cancel</button>
    <button *ngIf="data.count > 0" class="send-mails-button" mat-raised-button color="primary" [mat-dialog-close]="true">Confirm Send</button>
    <button *ngIf="data.count === 0" class="send-mails-button" mat-button [mat-dialog-close]="false">Close</button>
  </mat-dialog-actions>
`
})
export class ConfirmSendDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmSendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
