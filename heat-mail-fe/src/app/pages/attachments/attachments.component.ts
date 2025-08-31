import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-attachments',
  imports: [
    MatTableModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './attachments.component.html',
  styleUrl: './attachments.component.css'
})
export class AttachmentsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'mail_attachment_title', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  token: string | null = null;
  fullName: string = '';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.token = localStorage.getItem('angularLogin');
  }

  fetchAttachments(): void {
    const url = 'http://localhost:8084/heatmail/getMailAttachmentDashboard';

    if (!this.token) {
      alert('Authorization token is missing. Please log in again.');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (response) => {
        this.dataSource.data = response;
      },
      error: (error) => {
        console.error('Error fetching attachments:', error);
        alert('Failed to fetch attachments. Please try again.');
      }
    });
  }

  getCurrentUser(): Observable<any> {
    const url = 'http://localhost:8084/users/me';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(url, { headers });
  }

  ngOnInit(): void {
    this.fetchAttachments();
    
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.fullName = user.fullName;
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
      }
    });
  }

  onDeleteClick(element: any) {
    if (!this.token) {
      this.openErrorDialog("", "Authorization token is missing. Please log in again.");
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Confirm Attachment Deletion',
        message: `Are you sure you want to delete attachment "${element.mail_attachment_title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const url = 'http://localhost:8084/heatmail/deleteMailAttachment';
        const body = {
          id: element.id,
          mail_attachment_title: element.mail_attachment_title
        };

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        });

        this.http.delete(url, { headers: headers, body: body }).subscribe({
          next: response => {
            this.openSuccessDialog("Attachment successfully deleted", "Delete success");
            this.fetchAttachments(); // Refresh the table
          },
          error: err => {
            if (err.error?.description?.includes('JWT expired')) {
              this.openErrorDialog('', "Your session has timed out. Please log in again.");
              localStorage.removeItem("angularLogin");
              this.router.navigate(['']);
            } else {
              this.openErrorDialog(err.error?.description || '', "Failed to delete attachment. Please try again.");
            }
          }
        });
      }
    });
  }

  openErrorDialog(message: string, title: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: "600px",
      panelClass: 'custom-dialog-container',
      data: {message, title},
    });
  }

  openSuccessDialog(message: string, title: string): void {
    this.dialog.open(SuccessDialogComponent, {
      width: "600px",
      panelClass: 'custom-dialog-container',
      data: {message, title},
    });
  }

  navigateToAddMails(): void {
    this.router.navigate(['/addMails']);
  }
}
