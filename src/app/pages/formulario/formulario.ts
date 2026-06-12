import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormularioService } from '../../services/formularioService';

interface ModeloFlags {
  autoFechaEmision: boolean;
  autoCreditos: boolean;
}

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})
export class Formulario {
  readonly MAX_MODELOS = 12;
  modeloFlags: ModeloFlags[] = [];

  private readonly FOLIOS_URL = 'assets/folios.json';
  private foliosPorFecha: Record<string, string> = {};
  private MODELO_NOMBRE_ARCHIVO_MAP: Record<string, string> = {
    INSTITUTO: 'Instituto',
    UNIVERSIDAD_2QRS: 'Universidad 2QRS',
    UNIVERSIDAD_AZUL: 'Universidad Azul',
    COLEGIO_ABOGADOS_CALLAO: 'Colegio de Abogados del Callao',
    COLEGIO_DE_PROFESORES_DEL_PERU: 'Colegio de Profesores del Perú',
  };

  private construirNombreArchivoDesdeFormulario(): string {
    const primerModelo = this.modelos.at(0) as FormGroup;

    const nombres = (primerModelo.get('nombres')?.value ?? '').toString();
    const apellidos = (primerModelo.get('apellidos')?.value ?? '').toString();
    const modeloCertificado = (primerModelo.get('modeloCertificado')?.value ?? '').toString();

    const nombreCompleto = this.capitalizarNombreCompleto(`${nombres} ${apellidos}`);
    const nombreModelo =
      this.MODELO_NOMBRE_ARCHIVO_MAP[modeloCertificado] ?? modeloCertificado.replaceAll('_', ' ');

    return this.limpiarNombreArchivo(`${nombreCompleto} - ${nombreModelo}.pptx`);
  }

  private capitalizarNombreCompleto(texto: string): string {
    return texto
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }

  private limpiarNombreArchivo(texto: string): string {
    return texto
      .normalize('NFC')
      .replace(/[\\/:*?"<>|]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  isTemaExcedidoUADiplomado(i: number): boolean {
    const grupo = this.modelos.at(i) as FormGroup;
    if (!grupo) return false;

    if (!this.esUADiplomado(grupo)) return false;

    const tema: string = (grupo.get('temaDiplomado')?.value ?? '').toString();

    // alerta cuando está en el límite o lo supera
    return tema.length >= this.MAX_TEMA_UA_DIPLOMADO;
  }

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
    COLEGIO_ABOGADOS_CALLAO: '#0e8914',
    COLEGIO_DE_PROFESORES_DEL_PERU: '#00af9e',
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
    private http: HttpClient,
  ) {
    this.form = this.fb.group({
      modelos: this.fb.array([]),
    });

    this.modelos.push(this.crearModeloForm(0));
    this.cargarFolios();
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

  private propagarModeloCertificado(valor: string, origenIndex: number): void {
    this.modelos.controls.forEach((ctrl, i) => {
      if (i === origenIndex) return;

      const modeloCtrl = (ctrl as FormGroup).get('modeloCertificado');
      if (modeloCtrl && modeloCtrl.value !== valor) {
        modeloCtrl.setValue(valor, { emitEvent: false });
      }
    });

    // 🔥 actualizar color de fondo una sola vez
    this.actualizarColorFondo();
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

  private cargarFolios(): void {
    this.http.get<Record<string, string>>(this.FOLIOS_URL).subscribe({
      next: (folios) => {
        this.foliosPorFecha = folios ?? {};
        this.recalcularTodosLosFolios();
      },
      error: (err) => {
        console.error('No se pudo cargar el archivo de folios:', err);
        this.foliosPorFecha = {};
      },
    });
  }

  private obtenerPrefijoFolioPorFecha(fechaEmision?: string | null): string {
    const fecha = (fechaEmision ?? '').toString().trim();

    if (!fecha) return '';

    return this.foliosPorFecha[fecha] ?? '';
  }

  private recalcularTodosLosFolios(): void {
    this.modelos.controls.forEach((ctrl) => {
      this.actualizarFolioDeGrupo(ctrl as FormGroup);
    });
  }

  private actualizarFolioDeGrupo(grupo: FormGroup): void {
    const nombres = grupo.get('nombres')?.value;
    const apellidos = grupo.get('apellidos')?.value;
    const fechaEmision = grupo.get('fechaEmision')?.value;
    const modeloCertificado = grupo.get('modeloCertificado')?.value;

    const folioCtrl = grupo.get('folioNumero');
    if (!folioCtrl) return;

    const nuevoFolio = this.generarFolio(nombres, apellidos, fechaEmision, modeloCertificado);

    folioCtrl.setValue(nuevoFolio, { emitEvent: false });
  }

  crearModeloForm(
    index: number,
    nombres: string = '',
    apellidos: string = '',
    codigoEstudiante: string = '',
  ): FormGroup {
    this.modeloFlags[index] = {
      autoFechaEmision: true,
      autoCreditos: true,
    };

    const grupo = this.fb.group({
      modeloCertificado: [
        this.modelos.at(0)?.get('modeloCertificado')?.value || '',
        Validators.required,
      ],
      tipoModelo: ['', Validators.required],

      nombres: [nombres, [Validators.required, Validators.minLength(2)]],
      apellidos: [apellidos, [Validators.required, Validators.minLength(2)]],

      temaDiplomado: ['', [Validators.required, Validators.minLength(3)]],

      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],

      horasAcademicas: [null, [Validators.required, Validators.min(1)]],
      creditosAcademicos: [0, [Validators.required, Validators.min(0)]],

      folioNumero: ['', [Validators.required, Validators.minLength(3)]],
      fechaEmision: ['', Validators.required],
      codigoEstudiante: [codigoEstudiante],
      ciudad: ['Trujillo', [Validators.required, Validators.minLength(2)]],
    });

    // ---------- FECHA FIN → FECHA INICIO + EMISIÓN ----------
    grupo.get('fechaFin')?.valueChanges.subscribe((fechaFin) => {
      this.calcularFechaInicio(grupo);

      const flags = this.modeloFlags[index];
      const fechaEmisionCtrl = grupo.get('fechaEmision');

      if (!flags || !fechaEmisionCtrl || !fechaFin) return;

      // 🔁 AL CAMBIAR FECHA FIN, EL SISTEMA RECUPERA CONTROL
      flags.autoFechaEmision = true;

      fechaEmisionCtrl.setValue(fechaFin, { emitEvent: false });

      // ✅ FORZAR ACTUALIZACIÓN INMEDIATA DEL FOLIO
      actualizarFolio();
    });

    // ---------- FECHA EMISIÓN MANUAL ----------
    grupo.get('fechaEmision')?.valueChanges.subscribe(() => {
      const flags = this.modeloFlags[index];
      if (flags) flags.autoFechaEmision = false;
    });

    // ---------- HORAS → CRÉDITOS ----------
    grupo.get('horasAcademicas')?.valueChanges.subscribe((horas) => {
      this.calcularFechaInicio(grupo);

      const flags = this.modeloFlags[index];
      const creditosCtrl = grupo.get('creditosAcademicos');
      const horasNumber = Number(horas);

      if (!creditosCtrl || !flags) return;

      // 🔁 al cambiar horas, el sistema recupera control
      flags.autoCreditos = true;

      if (isNaN(horasNumber) || horasNumber <= 0) {
        creditosCtrl.setValue(0, { emitEvent: false });
        return;
      }

      const creditos = this.calcularCreditos(horasNumber);
      creditosCtrl.setValue(creditos, { emitEvent: false });
    });

    // ---------- CRÉDITOS MANUAL ----------
    grupo.get('creditosAcademicos')?.valueChanges.subscribe(() => {
      const flags = this.modeloFlags[index];
      if (flags) flags.autoCreditos = false;
    });

    grupo.get('modeloCertificado')?.valueChanges.subscribe((valor) => {
      if (!valor) return;

      // 1️⃣ Propagar a todos los certificados
      this.propagarModeloCertificado(valor, index);

      // 2️⃣ Recalcular folio (por si cambia Universidad Azul)
      actualizarFolio();
    });

    // const actualizarFolio = () => {
    //   const nombres = grupo.get('nombres')?.value;
    //   const apellidos = grupo.get('apellidos')?.value;
    //   const fechaEmision = grupo.get('fechaEmision')?.value;
    //   const modeloCertificado = grupo.get('modeloCertificado')?.value;

    //   const folioCtrl = grupo.get('folioNumero');
    //   if (!folioCtrl) return;

    //   const folioActual = folioCtrl.value;

    //   const nuevoFolio = this.generarFolio(
    //     nombres,
    //     apellidos,
    //     fechaEmision,
    //     modeloCertificado,
    //     folioActual,
    //   );

    //   folioCtrl.setValue(nuevoFolio, { emitEvent: false });
    // };

    const actualizarFolio = () => {
      this.actualizarFolioDeGrupo(grupo);
    };

    grupo.get('nombres')?.valueChanges.subscribe(actualizarFolio);
    grupo.get('apellidos')?.valueChanges.subscribe(actualizarFolio);
    grupo.get('fechaEmision')?.valueChanges.subscribe(actualizarFolio);
    grupo.get('modeloCertificado')?.valueChanges.subscribe(actualizarFolio);

    return grupo;
  }

  readonly MAX_TEMA_UA_DIPLOMADO = 95;

  private esUADiplomado(grupo: FormGroup): boolean {
    const modelo = grupo.get('modeloCertificado')?.value;
    const tipo = grupo.get('tipoModelo')?.value;
    return modelo === 'UNIVERSIDAD_AZUL' && tipo === 'DIPLOMADO';
  }

  onTemaInput(i: number): void {
    const grupo = this.modelos.at(i) as FormGroup;
    if (!grupo) return;

    // Solo aplica para Universidad Azul + Diplomado
    if (!this.esUADiplomado(grupo)) return;

    const ctrl = grupo.get('temaDiplomado');
    if (!ctrl) return;

    const original = (ctrl.value ?? '').toString();

    // 1) Convertir múltiples espacios en 1 (en cualquier parte del texto)
    // 2) Mantener el texto tal cual (no quitamos espacios simples)
    let normalizado = original.replace(/\s{2,}/g, ' ');

    // 3) Limitar a 102 caracteres exactos (incluye espacios)
    if (normalizado.length > this.MAX_TEMA_UA_DIPLOMADO) {
      normalizado = normalizado.slice(0, this.MAX_TEMA_UA_DIPLOMADO);
    }

    // Solo actualiza si cambió, para evitar loops
    if (normalizado !== original) {
      ctrl.setValue(normalizado, { emitEvent: false });
    }
  }

  private incrementarCodigoEstudiante(codigo: string): string {
    const valor = (codigo ?? '').toString().trim();

    if (!valor) return '';

    const match = valor.match(/(\d+)(?!.*\d)/);

    if (!match) return valor;

    const numeroActual = match[0];
    const inicio = match.index ?? 0;

    const numeroIncrementado = String(Number(numeroActual) + 1).padStart(numeroActual.length, '0');

    return valor.slice(0, inicio) + numeroIncrementado + valor.slice(inicio + numeroActual.length);
  }

  agregarModelo(): void {
    if (this.modelos.length >= this.MAX_MODELOS) {
      alert(`Solo se permite un máximo de ${this.MAX_MODELOS} certificados.`);
      return;
    }

    const index = this.modelos.length;

    const primerModelo = this.modelos.at(0) as FormGroup;
    const ultimoModelo = this.modelos.at(this.modelos.length - 1) as FormGroup;

    const nombres = primerModelo.get('nombres')?.value || '';
    const apellidos = primerModelo.get('apellidos')?.value || '';

    const codigoActual = ultimoModelo.get('codigoEstudiante')?.value || '';
    const siguienteCodigo = this.incrementarCodigoEstudiante(codigoActual);

    this.modelos.push(this.crearModeloForm(index, nombres, apellidos, siguienteCodigo));
  }

  eliminarModelo(index: number): void {
    this.modeloFlags.splice(index, 1);

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

    // const payload = { items: this.modelos.value };
    const items = this.modelos.controls.map((ctrl, i) => {
      const g = ctrl as FormGroup;
      return {
        ...g.value,
        qrSlug: this.qrSlugs[i], // ✅ nuevo
      };
    });

    const payload = { items };

    // this.service.generarPPTX(payload).subscribe({
    //   next: (archivo: Blob) => this.descargarArchivo(archivo),
    //   error: (err) => {
    //     console.error('ERROR BACKEND:', err);
    //     alert('Error al generar el PPTX. Revisa la consola.');
    //   },
    // });
    this.service.generarPPTX(payload).subscribe({
      next: (response) => {
        const archivo = response.body;

        if (!archivo) {
          alert('No se recibió el archivo PPTX.');
          return;
        }

        const contentDisposition = response.headers.get('Content-Disposition');

        const nombreArchivo = this.obtenerNombreArchivoDesdeContentDisposition(contentDisposition);

        this.descargarArchivo(archivo, nombreArchivo);
      },
      error: (err) => {
        console.error('ERROR BACKEND:', err);
        alert('Error al generar el PPTX. Revisa la consola.');
      },
    });
  }

  // private descargarArchivo(blob: Blob): void {
  //   const pptxBlob = new Blob([blob], {
  //     type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  //   });

  //   const url = window.URL.createObjectURL(pptxBlob);

  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `CERTIFICADOS_${Date.now()}.pptx`;

  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);

  //   window.URL.revokeObjectURL(url);
  // }

  private descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const pptxBlob = new Blob([blob], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });

    const url = window.URL.createObjectURL(pptxBlob);

    const a = document.createElement('a');
    a.href = url;

    // Ahora ya NO usamos CERTIFICADOS_${Date.now()}.
    // Usamos el nombre que viene del backend.
    a.download = nombreArchivo;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  }

  private obtenerNombreArchivoDesdeContentDisposition(contentDisposition: string | null): string {
    if (!contentDisposition) {
      return this.construirNombreArchivoDesdeFormulario();
    }

    // Caso recomendado por backend:
    // filename*=UTF-8''Diana%20Carolina%20Ch%C3%A1vez%20-%20Universidad%202QRS.pptx
    const filenameUtf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

    if (filenameUtf8Match?.[1]) {
      return decodeURIComponent(filenameUtf8Match[1].trim().replace(/^"|"$/g, ''));
    }

    // Caso alternativo:
    // filename="Diana_Carolina_Chavez_-_Universidad_2QRS.pptx"
    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/i);

    if (filenameMatch?.[1]) {
      return filenameMatch[1].trim();
    }

    return this.construirNombreArchivoDesdeFormulario();
  }

  limpiarFormulario(): void {
    this.modeloFlags = [];

    this.modelos.clear();
    this.modelos.push(this.crearModeloForm(0));

    this.qrSlugs = [];
    this.mostrarQrSlugs = false;

    this.renderer.setStyle(document.body, 'background-color', '#f3f4f6');
  }

  private calcularCreditos(horas: number): number {
    if (!horas || horas <= 0) return 0;

    // División exacta entre 16
    return Math.round((horas / 16) * 100) / 100; // 2 decimales
  }

  // private generarFolio(
  //   nombres?: string | null,
  //   apellidos?: string | null,
  //   fechaEmision?: string | null,
  //   modeloCertificado?: string | null,
  //   folioActual?: string | null,
  // ): string {
  //   if (!fechaEmision) return '';

  //   const year = new Date(fechaEmision).getFullYear();

  //   // 🟢 1. EXTRAER PREFIJO EXISTENTE (antes del primer " - ")
  //   let prefijo = '';
  //   if (folioActual && folioActual.includes(' - ')) {
  //     prefijo = folioActual.split(' - ')[0];
  //   }

  //   // Si no hay prefijo, lo dejamos vacío
  //   const base = prefijo ? `${prefijo} - ${year}` : ` - ${year}`;

  //   // 🚫 Caso especial: Universidad Azul
  //   if (modeloCertificado === 'UNIVERSIDAD_AZUL') {
  //     return base;
  //   }

  //   // 🟢 2. CALCULAR INICIALES
  //   const nombreSeguro = nombres ?? '';
  //   const apellidosSeguro = apellidos ?? '';

  //   const primerNombre = nombreSeguro.trim().charAt(0) || '';
  //   const partesApellidos = apellidosSeguro.trim().split(/\s+/);
  //   const primerApellido = partesApellidos[0]?.charAt(0) || '';
  //   const segundoApellido = partesApellidos[1]?.charAt(0) || '';

  //   const iniciales = (primerNombre + primerApellido + segundoApellido).toUpperCase();

  //   return `${base} - ${iniciales}`;
  // }

  private generarFolio(
    nombres?: string | null,
    apellidos?: string | null,
    fechaEmision?: string | null,
    modeloCertificado?: string | null,
  ): string {
    if (!fechaEmision) return '';

    const fechaSegura = fechaEmision.toString().trim();

    // Extraemos el año directamente del string YYYY-MM-DD.
    // Esto evita errores de zona horaria con new Date('YYYY-MM-DD').
    const year = fechaSegura.slice(0, 4);

    // Número de folio según la fecha del JSON.
    const prefijo = this.obtenerPrefijoFolioPorFecha(fechaSegura);

    const base = prefijo ? `${prefijo} - ${year}` : ` - ${year}`;

    // 🚫 Caso especial: Universidad Azul
    if (modeloCertificado === 'UNIVERSIDAD_AZUL') {
      return base;
    }

    const nombreSeguro = nombres ?? '';
    const apellidosSeguro = apellidos ?? '';

    const primerNombre = nombreSeguro.trim().charAt(0) || '';
    const partesApellidos = apellidosSeguro.trim().split(/\s+/);
    const primerApellido = partesApellidos[0]?.charAt(0) || '';
    const segundoApellido = partesApellidos[1]?.charAt(0) || '';

    const iniciales = (primerNombre + primerApellido + segundoApellido).toUpperCase();

    return iniciales ? `${base} - ${iniciales}` : base;
  }
}
