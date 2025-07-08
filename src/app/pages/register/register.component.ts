import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Usuario} from "../../models/usuario.model"; // ← esta línea es vital

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  userType: 'user' | 'admin' = 'user';

  showPassword = false;
  showConfirmPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const payload: Omit<Usuario, 'user_id'> = {
      username: this.username,
      email: this.email,
      password: this.password,
      user_type: this.userType,
      registration_date: new Date().toISOString()
    };

    this.auth.register(payload).subscribe({
      next: user => {
        alert('Usuario registrado con éxito');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error(err);
        alert('Ocurrió un error al registrar el usuario');
      }
    });
  }
}
