import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Configuracion} from "./pages/configuracion/configuracion";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Configuracion],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {

  protected title = 'Finanzas';
}
