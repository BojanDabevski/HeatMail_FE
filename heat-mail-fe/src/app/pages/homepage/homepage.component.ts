import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule} from '@angular/forms'
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-homepage',
  imports: [FormsModule,MatButtonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  http = inject(HttpClient);
  constructor(private router:Router) {
    
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
