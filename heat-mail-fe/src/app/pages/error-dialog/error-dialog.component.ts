import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, title: string },private router:Router) {}

  http = inject(HttpClient);
  
  navigateToRegister(): void {
    debugger;
    this.router.navigate(['/register']);
  }
}
