// add-mails.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-mails',
  imports: [CommonModule],
  templateUrl: './add-mails.component.html',
  styleUrl: './add-mails.component.css'
})
export class AddMailsComponent implements OnInit{
  selectedFile?: File;
  validationMessage = '';
  isProcessing = false;
  fullName: string = '';
  token: string | null = null;

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
 private getCurrentUser(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get('http://localhost:8084/users/me', { headers });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.validationMessage = '';
    
    if (this.selectedFile) {
      this.validateExcelStructure();
    }
  }

  private validateExcelStructure(): void {
    const reader = new FileReader();
    debugger;
  
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData ||(jsonData as any[]).length === 0 ||!jsonData[0] ||!(jsonData[0] as any[]).length) {
          this.openErrorDialog('Invalid File', 'The Excel file is empty or does not contain headers.');
          this.selectedFile = undefined;
          return;
        }
  
        const expectedHeaders = ['month', 'year', 'mail_body', 'mail_title', 'mail_receiver','mail_body_variables'];
        const actualHeaders = jsonData[0] as string[];
  
        if (!expectedHeaders.every(h => actualHeaders.includes(h))) {
          this.openErrorDialog(
            'Invalid Excel Structure',
            'Required columns: ' + expectedHeaders.join(', ')
          );
          this.selectedFile = undefined;
        }
      } catch (err) {
        this.openErrorDialog('Error', 'An error occurred while processing the Excel file.');
        this.selectedFile = undefined;
      }
    };
  
    reader.onerror = (e: any) => {
      // FileReader error event
      this.openErrorDialog('File Read Error', 'Failed to read the selected file.');
      this.selectedFile = undefined;
    };
  
    if (this.selectedFile) {
      reader.readAsArrayBuffer(this.selectedFile);
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    this.isProcessing = true;
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Convert to API format
      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1);
      
      const payload = rows.map((row: any) => ({
        month: row[headers.indexOf('month')].toString().padStart(2, '0'),
        year: row[headers.indexOf('year')].toString(),
        mail_body: row[headers.indexOf('mail_body')],
        mail_title: row[headers.indexOf('mail_title')],
        mail_receiver: row[headers.indexOf('mail_receiver')],
        mail_body_variables: row[headers.indexOf('mail_body_variables')]
      }));

      this.sendDataToBackend(payload);
    };

    reader.readAsArrayBuffer(this.selectedFile!);
  }

  private sendDataToBackend(payload: any[]): void {
    // const token = localStorage.getItem('angularLogin');
    
    if (!this.token) {
      this.openErrorDialog('Authorization Error', 'Please log in again.');
      this.isProcessing = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8084/heatmail/insertMail', payload, { headers })
      .subscribe({
        next: () => {
          this.dialog.open(SuccessDialogComponent, {
            width: "600px",
            panelClass: 'custom-dialog-container',
            data: { 
              title: 'Success', 
              message: `${payload.length} mails successfully added!` 
            }
          });
          this.selectedFile = undefined;
        },
        error: (err) => {
          console.error('Error uploading data:', err);
          this.openErrorDialog('Upload Failed', err.error?.description || 'Failed to upload data');
        },
        complete: () => this.isProcessing = false
      });
  }

  private openErrorDialog(title: string, message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: "600px",
      panelClass: 'custom-dialog-container',
      data: { title, message }
    });
  }
}
