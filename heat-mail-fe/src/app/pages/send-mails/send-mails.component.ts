import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component'; // Create this if needed
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ConfirmSendDialogComponent } from '../confirm-send-dialog/confirm-send-dialog.component';

@Component({
  selector: 'app-send-mails',
  templateUrl: './send-mails.component.html',
  styleUrls: ['./send-mails.component.css'],
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule
]
})
export class SendMailsComponent implements OnInit {
  selectedDate: Date | null = null;
  selectedMonth: string = '';
  selectedYear: string = '';
  token: string | null = null;
  fullName: string = '';

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.token = localStorage.getItem('angularLogin');
  }

  ngOnInit(): void {
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.fullName = user.fullName;
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
      }
    });
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value; // Update selectedDate with the picked date
    const selectedDate = new Date(event.value);
    this.selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Convert to "MM" format
    this.selectedYear = selectedDate.getFullYear().toString();
  }

  onMonthSelected(event: any, datepicker: any): void {
    const selectedDate = new Date(event);
    this.selectedDate = selectedDate; // Update selectedDate with the picked date
    this.selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = selectedDate.getFullYear().toString();
    datepicker.close();
  }
  checkAvailableMails(): void {
    if (!this.token) {
      this.openErrorDialog('Authorization Error', 'Please log in again.');
      return;
    }

    if (!this.selectedMonth || !this.selectedYear) {
      this.openErrorDialog('Validation Error', 'Please select a valid date.');
      return;
    }

    const url = 'http://localhost:8084/heatmail/getAvailableMailToSendCount';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      month: this.selectedMonth,
      year: this.selectedYear
    };

    this.http.post<{ count: number }>(url, body, { headers }).subscribe({
      next: (response) => {
        this.openConfirmationDialog(response.count);
      },
      error: (error) => {
        console.error('Error checking available mails:', error);
        this.openErrorDialog('Check Failed', error.error?.description || 'Failed to check available mails');
      }
    });
  }

  private openConfirmationDialog(count: number): void {
    const dialogRef = this.dialog.open(ConfirmSendDialogComponent, {
      width: "600px",
      panelClass: 'custom-dialog-container',
      data: {
        title: count > 0 ? 'Confirm HeatMail Sending' : 'No HeatMails Available',
        message: count > 0 ? 
          `You're about to send ${count} emails. Are you sure you want to proceed?` :
          'There are no emails available to send for the selected month/year.',
        count: count
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.sendMail();
      }
    });
  }

  sendMail(): void {
    if (!this.token) {
      this.openErrorDialog('Authorization Error', 'Please log in again.');
      return;
    }

    if (!this.selectedMonth || !this.selectedYear) {
      this.openErrorDialog('Validation Error', 'Please select a valid date.');
      return;
    }

    const url = 'http://localhost:8084/heatmail/sendMail';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      month: this.selectedMonth,
      year: this.selectedYear
    };

    this.http.post(url, body, { headers }).subscribe({
      next: (response) => {
        this.openSuccessDialog('Mails Sent', 'Mails have been queued for sending successfully!');
      },
      error: (error) => {
        console.error('Error sending mails:', error);
        this.openErrorDialog('Sending Failed', error.error?.description || 'Failed to send mails');
      }
    });
  }

  private getCurrentUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get('http://localhost:8084/users/me', { headers });
  }

  private openErrorDialog(title: string, message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: "600px",
      panelClass: 'custom-dialog-container',
      data: { title, message }
    });
  }

  private openSuccessDialog(title: string, message: string): void {
    this.dialog.open(SuccessDialogComponent, {
      width: "600px",
      panelClass: 'custom-dialog-container',
      data: { title, message }
    });
  }
}