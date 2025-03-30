import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule} from '@angular/forms'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj:any ={
    "email": "",
    "password": ""
  }

  http = inject(HttpClient);
  constructor(private router:Router, private dialog: MatDialog) {
    
  }

  onLogin() {
    try {
      debugger;
      this.http.post("http://localhost:8081/auth/login", this.loginObj)
        .subscribe({
          next: (res: any) => {
            debugger;
            if (res.token != null) {
              localStorage.setItem("angularLogin", res.token);
              this.router.navigateByUrl("dashboard");
              
            } else {
              alert(res.description);
            }
          },
          error: (error) => {
            debugger;
            this.openErrorDialog(error.error.description,"Login Error");
          }
        });
    } catch (error) {
      debugger;
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

   openErrorDialog(message: string,title: string): void {
      debugger;
      const dialogRef = this.dialog.open(ErrorDialogComponent, {
        width: "600px",
        panelClass: 'custom-dialog-container',
        data: {message,title},
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.loginObj = {
          email: "",
          password: ""
        };
      });
    }
}
 