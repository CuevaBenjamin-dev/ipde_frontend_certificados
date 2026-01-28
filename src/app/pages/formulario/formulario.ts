import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
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

  private MODELO_COLOR_MAP: Record<string, string> = {
    INSTITUTO: '#3b3a40',
    UNIVERSIDAD_2QRS: '#D14900',
    UNIVERSIDAD_AZUL: '#004B57',
    COLEGIO_ABOGADOS_CALLAO: '#b7ff00', // azul institucional sobrio
  };

  private HORAS_A_MESES: Record<number, number> = {
    120: 1,
    240: 2,
    360: 3,
    420: 4,
    600: 6,
    840: 8,
    1200: 12,
  };

  constructor(
    private fb: FormBuilder,
    private service: FormularioService,
    private renderer: Renderer2
  ) {
    this.form = this.fb.group({
      modelos: this.fb.array([this.crearModeloForm()]),
    });

    this.renderer.setStyle(document.body, 'background-color', '#f3f4f6');
    this.renderer.setStyle(
      document.body,
      'transition',
      'background-color 0.4s ease'
    );
  }

  get modelos(): FormArray {
    return this.form.get('modelos') as FormArray;
  }

  private actualizarColorFondo(): void {
    const primerModelo = this.modelos.at(0) as FormGroup;
    const tipo = primerModelo.get('modeloCertificado')?.value;

    const color = this.MODELO_COLOR_MAP[tipo] || '#f3f4f6';
    this.renderer.setStyle(document.body, 'background-color', color);
  }

  private calcularFechaInicio(modelo: FormGroup): void {
    const fechaFinValue = modelo.get('fechaFin')?.value;
    const horas = modelo.get('horasAcademicas')?.value;

    if (!fechaFinValue || !horas) return;

    const meses = this.HORAS_A_MESES[horas];
    if (!meses) return;

    const fechaFin = new Date(fechaFinValue);
    const fechaBase = new Date(
      fechaFin.getFullYear(),
      fechaFin.getMonth() - meses,
      fechaFin.getDate()
    );

    let fechaInicio = new Date(fechaBase);
    while (fechaInicio.getDay() !== 1) {
      fechaInicio.setDate(fechaInicio.getDate() - 1);
    }

    const yyyy = fechaInicio.getFullYear();
    const mm = String(fechaInicio.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaInicio.getDate()).padStart(2, '0');

    modelo.get('fechaInicio')?.setValue(`${yyyy}-${mm}-${dd}`, {
      emitEvent: false,
    });
  }

  crearModeloForm(nombres: string = '', apellidos: string = ''): FormGroup {
    const grupo = this.fb.group({
      modeloCertificado: ['', Validators.required],
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

    grupo.get('fechaFin')?.valueChanges.subscribe(() =>
      this.calcularFechaInicio(grupo)
    );

    grupo.get('horasAcademicas')?.valueChanges.subscribe(() =>
      this.calcularFechaInicio(grupo)
    );

    grupo.get('modeloCertificado')?.valueChanges.subscribe(() =>
      this.actualizarColorFondo()
    );

    return grupo;
  }

  agregarModelo(): void {
    const primerModelo = this.modelos.at(0) as FormGroup;
    const nombres = primerModelo.get('nombres')?.value || '';
    const apellidos = primerModelo.get('apellidos')?.value || '';

    this.modelos.push(this.crearModeloForm(nombres, apellidos));
  }

  eliminarModelo(index: number): void {
    if (this.modelos.length > 1) {
      this.modelos.removeAt(index);
      this.actualizarColorFondo();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { items: this.modelos.value };

    this.service.generarPPTX(payload).subscribe({
      next: (archivo: Blob) => this.descargarArchivo(archivo),
      error: () => alert('Ocurrió un error al generar el PPTX'),
    });
  }

  private descargarArchivo(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CERTIFICADOS_${Date.now()}.pptx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
