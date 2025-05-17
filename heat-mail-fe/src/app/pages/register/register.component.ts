import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerObj: any = {
    email: "",
    password: "",
    fullName: ""
  };

  http = inject(HttpClient);
  constructor(private router: Router, private dialog: MatDialog) {}

  navigateToHomepage(): void {
    this.router.navigate(['/homepage']);
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  onRegister() {
    try {
      debugger;
      this.http.post("http://localhost:8084/auth/signup", this.registerObj)
        .subscribe({
          next: (res: any) => {
            debugger;
            if (res.id != null) {
              alert("Register Success");
              this.router.navigateByUrl("login");
            } else {
              alert(res.description);
            }
          },
          error: (error) => {
            debugger;
            this.openErrorDialog(error.error.description,"Registration Error");
          }
        });
    } catch (error) {
      debugger;
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  }

  openErrorDialog(message: string,title: string): void {
    debugger;
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: "600px",
      panelClass: 'custom-dialog-container',
      data: {message,title},
    });

    dialogRef.afterClosed().subscribe(() => {
      this.registerObj = {
        email: "",
        password: "",
        fullName: ""
      };
    });
  }
}
