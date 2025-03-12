import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule} from '@angular/forms'
import { Router } from '@angular/router';

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
  constructor(private router:Router) {
    
  }

  onLogin() {
    try {
      debugger;
      this.http.post("http://localhost:8081/auth/login", this.loginObj)
        .subscribe({
          next: (res: any) => {
            debugger;
            if (res.token != null) {
              alert("Login Success" + res.token);
              localStorage.setItem("angularLogin", res.token);
              this.router.navigateByUrl("dashboard");
              
            } else {
              alert(res.description);
            }
          },
          error: (error) => {
            debugger;
            console.error('Login error:', error);
            alert(error.error.description);
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
}
 