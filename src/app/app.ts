import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Configuracion} from "./pages/configuracion/configuracion";
import {Navbar} from "./shared/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Configuracion, Navbar],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {

  protected title = 'Finanzas';
}
