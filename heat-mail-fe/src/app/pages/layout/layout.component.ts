import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,MatButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
    http = inject(HttpClient);
    constructor(private router:Router) {
      
    }

  navigateToHome(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void{
    const localData = localStorage.getItem("angularLogin");
    localStorage.removeItem("angularLogin");
    this.router.navigate(['']);
  }

}
