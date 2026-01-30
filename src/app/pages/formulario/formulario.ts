import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormularioService } from '../../services/formularioService';

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})
export class Formulario {
  form: FormGroup;

  qrSlugs: string[] = [];
  mostrarQrSlugs = false;

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quitar tildes
      .replace(/[^a-zA-Z0-9]/g, '') // quitar espacios y símbolos
      .toLowerCase();
  }

  private generarSlugQR(nombres: string, apellidos: string, tema: string): string {
    const primerNombre = nombres.trim().split(' ')[0] || '';
    const primerApellido = apellidos.trim().split(' ')[0] || '';

    return (
      this.normalizarTexto(primerNombre) +
      this.normalizarTexto(primerApellido) +
      this.normalizarTexto(tema)
    );
  }

  private MODELO_COLOR_MAP: Record<string, string> = {
    INSTITUTO: '#3b3a40',
    UNIVERSIDAD_2QRS: '#D14900',
    UNIVERSIDAD_AZUL: '#004B57',
    COLEGIO_ABOGADOS_CALLAO: '#0e8914', // azul institucional sobrio
  };

  private HORAS_A_MESES: Record<number, number> = {
    40: 1,
    50: 1,
    60: 1,
    70: 1,
    80: 1,
    100: 1,
    120: 1,
    130: 2,
    140: 2,
    150: 2,
    160: 2,
    170: 2,
    180: 2,
    190: 2,
    200: 2,
    210: 2,
    220: 2,
    230: 2,
    240: 2,
    250: 2,
    260: 3,
    270: 3,
    280: 3,
    290: 3,
    300: 3,
    310: 3,
    320: 3,
    330: 3,
    340: 3,
    350: 3,
    360: 3,
    370: 4,
    380: 4,
    390: 4,
    400: 4,
    410: 4,
    420: 4,
    430: 4,
    440: 4,
    450: 4,
    460: 4,
    470: 4,
    480: 5,
    490: 5,
    500: 5,
    510: 5,
    520: 5,
    530: 5,
    540: 5,
    550: 5,
    560: 5,
    570: 6,
    580: 6,
    590: 6,
    600: 6,
    610: 6,
    620: 6,
    630: 6,
    640: 6,
    650: 6,
    660: 6,
    670: 6,
    680: 7,
    690: 7,
    700: 7,
    710: 7,
    720: 7,
    730: 7,
    740: 7,
    750: 7,
    760: 7,
    770: 7,
    780: 8,
    790: 8,
    800: 8,
    810: 8,
    820: 8,
    830: 8,
    840: 8,
    850: 8,
    860: 8,
    870: 9,
    880: 9,
    890: 9,
    900: 9,
    910: 9,
    920: 9,
    930: 9,
    940: 9,
    950: 9,
    960: 9,
    970: 10,
    980: 10,
    990: 10,
    1000: 10,
    1010: 10,
    1020: 10,
    1030: 10,
    1040: 10,
    1050: 10,
    1060: 10,
    1070: 10,
    1080: 11,
    1090: 11,
    1100: 11,
    1110: 11,
    1120: 11,
    1130: 11,
    1140: 11,
    1150: 12,
    1160: 12,
    1170: 12,
    1180: 12,
    1190: 12,
    1200: 12,
    1210: 12,
    1220: 12,
    1230: 12,
    1240: 12,
    1250: 12,
  };

  constructor(
    private fb: FormBuilder,
    private service: FormularioService,
    private renderer: Renderer2,
  ) {
    this.form = this.fb.group({
      modelos: this.fb.array([this.crearModeloForm()]),
    });

    this.renderer.setStyle(document.body, 'background-color', '#f3f4f6');
    this.renderer.setStyle(document.body, 'transition', 'background-color 0.4s ease');
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
      fechaFin.getDate(),
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

    grupo.get('fechaFin')?.valueChanges.subscribe(() => this.calcularFechaInicio(grupo));

    grupo.get('horasAcademicas')?.valueChanges.subscribe(() => this.calcularFechaInicio(grupo));

    grupo.get('modeloCertificado')?.valueChanges.subscribe(() => this.actualizarColorFondo());

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

    // 🔥 Generar slugs QR en el frontend
    this.qrSlugs = this.modelos.controls.map((grupo) => {
      const g = grupo as FormGroup;
      return this.generarSlugQR(
        g.get('nombres')?.value,
        g.get('apellidos')?.value,
        g.get('temaDiplomado')?.value,
      );
    });

    this.mostrarQrSlugs = true;

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
