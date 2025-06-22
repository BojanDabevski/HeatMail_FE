import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    MatPaginatorModule,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'month',
    'year',
    'mail_receiver',
    'mail_title',
    'mail_status',
    'inserted_at',
    'sent_at',
    'mail_attachment_title'
  ];
  dataSource = new MatTableDataSource<any>([]);

  selectedMonth: string = '';
  selectedYear: string = '';
  selectedDate: Date | null = null;
  token: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private dialog: MatDialog,private router:Router) {
    this.token = localStorage.getItem('angularLogin');
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    const selectedDate = new Date(event.value);
    this.selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = selectedDate.getFullYear().toString();
  }

  onMonthSelected(event: any, datepicker: any): void {
    const selectedDate = new Date(event);
    this.selectedDate = selectedDate;
    this.selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = selectedDate.getFullYear().toString();
    datepicker.close();
  }

  fetchDashboardData(): void {
    const url = 'http://localhost:8084/heatmail/getMailDashboard';

    if (!this.token) {
      this.openErrorDialog("","Authorization token is missing. Please log in again.");
      return;
    }

    const body = {
      month: this.selectedMonth,
      year: this.selectedYear
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      ContentType: 'application/json'
    });

    this.http.post<any[]>(url, body, { headers }).subscribe({
      next: (response) => {
        this.dataSource.data = response;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator; 
        }
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        if(error.error.description.includes('JWT expired at')){
          this.openErrorDialog('',"Your session has timed out. Please log in again");
          localStorage.removeItem("angularLogin");
          this.router.navigate(['']);

        }else{
          this.openErrorDialog(error.error.description,"Failed to fetch data. Please try again.");
        }
      }
    });
  }

  url1 = 'http://localhost:8084/users/me';
  fullName: string = '';
  getCurrentUser(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      ContentType: 'application/json'
    });
    return this.http.get<any>(this.url1, { headers });
  }

  ngOnInit(): void {
    
    const now = new Date();
    this.selectedDate = now;
    this.selectedMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    this.selectedYear = now.getFullYear().toString();

    this.fetchDashboardData();

    this.getCurrentUser().subscribe({
      next: (user) => {
        this.fullName = user.fullName;
      },
      error: (err) => {
        console.error('Failed to fetch user:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

   openErrorDialog(message: string,title: string): void {
        debugger;
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          width: "600px",
          panelClass: 'custom-dialog-container',
          data: {message,title},
        });
      }

      exportToCSV(): void {
        if (!this.dataSource.data || this.dataSource.data.length === 0) {
          alert('No data available to download.');
          return;
        }
      
        const csvHeaders = this.displayedColumns.map(col => col.replace(/_/g, ' ').toUpperCase());
      
        const csvRows = this.dataSource.data.map(row => {
          return this.displayedColumns.map(col => {
            let cell = row[col];
            if (cell instanceof Date) {
              return cell.toLocaleString();
            } else if (typeof cell === 'string') {
              // Escape double quotes
              return '"' + cell.replace(/"/g, '""') + '"';
            } else if (cell === null || cell === undefined) {
              return '';
            } else {
              return cell.toString();
            }
          }).join(',');
        });
      
        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
      
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `HeatMail_export_dashboard_data_${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    
       
}
