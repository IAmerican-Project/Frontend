import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // IMPORTANTE

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule], // AGREGA ESTO
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
