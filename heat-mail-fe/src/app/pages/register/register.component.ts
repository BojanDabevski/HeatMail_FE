import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule} from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerObj:any ={
    "email": "",
    "password": "",
    "fullName": ""
  }

  http = inject(HttpClient);
  constructor(private router:Router) {
    
  }

  onRegister() {
    try {
      debugger;
      this.http.post("http://localhost:8081/auth/signup", this.registerObj)
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
            console.error('Register error:', error);
            alert(error.error.description);
          }
        });
    } catch (error) {
      debugger;
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  }

}
