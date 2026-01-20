import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormularioService } from '../../services/formularioService';

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})
export class Formulario {
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: FormularioService) {
    this.form = this.fb.group({
      modelos: this.fb.array([this.crearModeloForm()]),
    });
  }

  /** Acceso rápido al FormArray */
  get modelos(): FormArray {
    return this.form.get('modelos') as FormArray;
  }

  /** Crea un FormGroup para un modelo */
  crearModeloForm(
    nombres: string = '',
    apellidos: string = ''
  ): FormGroup {
    return this.fb.group({
      tipoModelo: ['', Validators.required],

      nombres: [nombres, [Validators.required, Validators.minLength(2)]],
      apellidos: [apellidos, [Validators.required, Validators.minLength(2)]],

      temaDiplomado: ['', [Validators.required, Validators.minLength(3)]],

      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],

      horasAcademicas: [null, [Validators.required, Validators.min(1)]],
      creditosAcademicos: [null, [Validators.required, Validators.min(1)]],

      folioNumero: ['', [Validators.required, Validators.minLength(3)]],
      fechaEmision: ['', Validators.required],
    });
  }

  /** Agrega un nuevo modelo copiando nombres y apellidos */
  agregarModelo(): void {
    const primerModelo = this.modelos.at(0) as FormGroup;

    const nombres = primerModelo.get('nombres')?.value || '';
    const apellidos = primerModelo.get('apellidos')?.value || '';

    this.modelos.push(this.crearModeloForm(nombres, apellidos));
  }

  /** Elimina un modelo */
  eliminarModelo(index: number): void {
    if (this.modelos.length > 1) {
      this.modelos.removeAt(index);
    }
  }

  /** Enviar TODOS los modelos al backend */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      items: this.modelos.value,
    };

    this.service.generarPPTX(payload).subscribe({
      next: (archivo: Blob) => {
        this.descargarArchivo(archivo);
      },
      error: (err) => {
        console.error('Error al generar el PPTX', err);
        alert('Ocurrió un error al generar el PPTX');
      },
    });

    console.log('Payload enviado:', payload);
  }

  /** Descarga final */
  private descargarArchivo(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    a.download = `CERTIFICADOS_${new Date().getTime()}.pptx`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
