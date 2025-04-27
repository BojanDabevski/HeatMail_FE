import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statistics',
  imports: [MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule,],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  displayedColumns: string[] = [
    'statsType',
    'count',
  ];
  dataSource = new MatTableDataSource<any>([]);
  selectedMonth: string = '';
  selectedYear: string = '';
  selectedDate: Date | null = null; // Variable to hold the selected date
  token: string | null = null;
  
  constructor(private http: HttpClient) {
    // Retrieve the token from localStorage
    this.token = localStorage.getItem('angularLogin');
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

  fetchStatisticData(): void {
    const url = 'http://localhost:8084/heatmail/getMailStatistics';

    if (!this.token) {
      alert('Authorization token is missing. Please log in again.');
      return;
    }

    const body = {
      month: this.selectedMonth,
      year: this.selectedYear
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      ContentType: 'application/json' // Attach the token as a Bearer token
    });

    this.http.post<any[]>(url, body, { headers }).subscribe({
      next: (response) => {
        this.dataSource.data = response;
      },
      error: (error) => {
        console.error('Error fetching statistics data:', error);
        alert('Failed to fetch data. Please try again.');
      }
    });
  }

  url1= 'http://localhost:8084/users/me';
    fullName: string = '';
    getCurrentUser(): Observable<any> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        ContentType: 'application/json' 
      });
      return this.http.get<any>(this.url1, { headers });
    }
  
    ngOnInit(): void{

      const now = new Date();
      this.selectedDate = now;
      this.selectedMonth = (now.getMonth() + 1).toString().padStart(2, '0');
      this.selectedYear = now.getFullYear().toString();

      
      this.fetchStatisticData();

      debugger;
      this.getCurrentUser().subscribe({
        next: (user) => {
          
          this.fullName = user.fullName;
        },
        error: (err) => {
          console.error('Failed to fetch user:', err);
        }
      })
    }
}
