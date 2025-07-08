import {Routes} from "@angular/router";
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {Configuracion} from "./pages/configuracion/configuracion";
import {Results} from "./results/results";
import {CalculadoraMultiplicacion} from "./bonus-simulation/bonus-simulation";
import {AuthGuard} from "./services/auth.guard";


export const routes: Routes = [
    { path: '', component: HomeComponent,  },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {path: 'configuration', component: Configuracion,canActivate: [AuthGuard]},
    {path: 'bonos-simulation', component: CalculadoraMultiplicacion,canActivate: [AuthGuard]},
    {path: 'results', component: Results,canActivate: [AuthGuard]},



];
