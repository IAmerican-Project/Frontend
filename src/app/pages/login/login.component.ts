import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword = false;
  error = false;

  constructor(
      private authService: AuthService,
      private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const password = (form.querySelector('#password') as HTMLInputElement).value;

    this.authService.login(email, password).subscribe(user => {
      if (user) {
        this.error = false;
        this.router.navigate(['/configuration']);
      } else {
        this.error = true;
      }
    });
  }
}
