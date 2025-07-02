import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← esta línea es vital

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(event: Event): void {
    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity(); // ✅ Muestra los mensajes nativos como "Completa este campo"
      return;
    }

    // Aquí va tu lógica de registro si decides agregarla
    console.log('Formulario válido, proceder con registro...');
  }
}
