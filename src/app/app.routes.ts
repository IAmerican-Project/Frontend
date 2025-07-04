import {Routes} from "@angular/router";
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {Configuracion} from "./pages/configuracion/configuracion";
import {Results} from "./results/results";
import {CalculadoraMultiplicacion} from "./bonus-simulation/bonus-simulation";
import {TablaFlujoComponent} from "./public/tablaamericano/tablaamericano";


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {path: 'configuration', component: Configuracion,},
    {path: 'bonos-simulation', component: CalculadoraMultiplicacion,},
    {path: 'results', component: Results,},
    {path: 'american-table', component: TablaFlujoComponent,},



];
