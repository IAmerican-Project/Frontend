import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule     } from '@angular/material/input';
import { MatButtonModule    } from '@angular/material/button';
import {ParametrosSistemaService} from "../../services/parametros.sistema.services";
import {ParametrosSistema} from "../../models/parametros-sistema.model";

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css'],
})
export class Configuracion implements OnInit {
  form!: FormGroup;
  parametroId = 1;

  constructor(
      private fb: FormBuilder,
      private service: ParametrosSistemaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      currency_default: ['', Validators.required],
      days_in_year:      [360, Validators.required],
      vat_rate:         [0.18, Validators.required],
      income_tax_rate:  [0.3,  Validators.required],
    });

    this.service.getParametros()
        .subscribe((data: ParametrosSistema[]) => {
          const param = data[0];
          this.parametroId = param.parametro_id;
          this.form.patchValue(param);
        });
  }

  guardar(): void {
    if (this.form.valid) {
      this.service.updateParametros(this.parametroId, {
        ...this.form.value,
        parametro_id: this.parametroId,
      }).subscribe(() => {
        alert('¡Configuración guardada correctamente!');
      });
    }
  }
}