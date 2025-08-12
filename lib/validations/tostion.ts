import { z } from 'zod'
import {
  weightSchema,
  temperatureSchema,
  qualityScoreSchema,
  estadoProcesoSchema,
  nivelTostionSchema,
  tipoEventoTostionSchema,
  tipoAjusteTostionSchema,
  lotCodeSchema
} from './common'

// Esquema para perfil de tostión
export const perfilTostionSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  
  // Configuración inicial
  temperaturaInicial: temperatureSchema,
  temperaturaObjetivo: temperatureSchema,
  tiempoEstimado: z.number().int().min(5).max(30), // minutos
  flujoAireInicial: z.number().int().min(0).max(100), // porcentaje
  nivelTostion: nivelTostionSchema,
  
  // Eventos esperados
  firstCrackInicioEsperado: z.number().int().min(1).max(20).optional(),
  firstCrackFinalEsperado: z.number().int().min(1).max(25).optional(),
  secondCrackInicioEsperado: z.number().int().min(1).max(25).optional(),
  secondCrackFinalEsperado: z.number().int().min(1).max(30).optional(),
  
  esFavorito: z.boolean().default(false),
})

// Validaciones para perfil de tostión
export const perfilTostionSchemaWithValidations = perfilTostionSchema
  .refine((data) => {
    return data.temperaturaObjetivo > data.temperaturaInicial
  }, {
    message: 'La temperatura objetivo debe ser mayor a la inicial',
    path: ['temperaturaObjetivo']
  })
  .refine((data) => {
    // Validar secuencia lógica de cracks
    if (data.firstCrackInicioEsperado && data.firstCrackFinalEsperado) {
      return data.firstCrackFinalEsperado > data.firstCrackInicioEsperado
    }
    return true
  }, {
    message: 'El final del primer crack debe ser después del inicio',
    path: ['firstCrackFinalEsperado']
  })
  .refine((data) => {
    // Validar que second crack sea después de first crack
    if (data.firstCrackFinalEsperado && data.secondCrackInicioEsperado) {
      return data.secondCrackInicioEsperado > data.firstCrackFinalEsperado
    }
    return true
  }, {
    message: 'El segundo crack debe ser después del primer crack',
    path: ['secondCrackInicioEsperado']
  })

// Esquema para proceso de tostión
export const procesoTostionSchema = z.object({
  lotePergaminoId: z.string().cuid(),
  operadorId: z.string().cuid(),
  perfilToscionId: z.string().cuid().optional(),
  fechaProceso: z.date(),
  
  // Configuración del proceso
  cantidadInicialKg: weightSchema,
  temperaturaInicial: temperatureSchema,
  temperaturaObjetivo: temperatureSchema,
  tiempoEstimado: z.number().int().min(5).max(30),
  flujoAireInicial: z.number().int().min(0).max(100),
  nivelToscionObjetivo: nivelTostionSchema,
  
  // Resultados (opcionales al inicio, requeridos al completar)
  tiempoTotalMinutos: z.number().int().min(1).max(35).optional(),
  temperaturaFinal: temperatureSchema.optional(),
  nivelToscionAlcanzado: nivelTostionSchema.optional(),
  pesoFinalKg: weightSchema.optional(),
  
  // Control de calidad
  colorTostion: z.string().optional(),
  aromaPuntuacion: qualityScoreSchema.optional(),
  cuerpoBalanceado: z.boolean().optional(),
  acidezNivel: qualityScoreSchema.optional(),
  observacionesCalidad: z.string().optional(),
  
  codigoLoteTostado: lotCodeSchema.optional(),
})

// Esquema para datos de tostión en tiempo real
export const datoTostionSchema = z.object({
  procesoToscionId: z.string().cuid(),
  minuto: z.number().int().min(0).max(35),
  segundo: z.number().int().min(0).max(59).default(0),
  temperatura: temperatureSchema,
  ror: z.number().optional(), // Rate of Rise - calculado automáticamente
  flujoAire: z.number().int().min(0).max(100),
  nivelGas: z.number().int().min(0).max(100),
})

// Esquema para eventos de tostión
export const eventoTostionSchema = z.object({
  procesoToscionId: z.string().cuid(),
  tipoEvento: tipoEventoTostionSchema,
  minuto: z.number().int().min(0).max(35),
  segundo: z.number().int().min(0).max(59).default(0),
  temperatura: temperatureSchema.optional(),
  observaciones: z.string().optional(),
})

// Esquema para ajustes durante la tostión
export const ajusteTostionSchema = z.object({
  procesoToscionId: z.string().cuid(),
  minuto: z.number().int().min(0).max(35),
  segundo: z.number().int().min(0).max(59).default(0),
  tipoAjuste: tipoAjusteTostionSchema,
  valorAnterior: z.number().int().min(0).max(100),
  valorNuevo: z.number().int().min(0).max(100),
  observaciones: z.string().optional(),
})

// Esquema para finalizar proceso de tostión
export const finalizarTostionSchema = z.object({
  id: z.string().cuid(),
  tiempoTotalMinutos: z.number().int().min(1).max(35),
  temperaturaFinal: temperatureSchema,
  nivelToscionAlcanzado: nivelTostionSchema,
  pesoFinalKg: weightSchema,
  
  // Control de calidad
  colorTostion: z.string().optional(),
  aromaPuntuacion: qualityScoreSchema.optional(),
  cuerpoBalanceado: z.boolean().optional(),
  acidezNivel: qualityScoreSchema.optional(),
  observacionesCalidad: z.string().optional(),
})

// Validación para finalizar tostión
export const finalizarTostionSchemaWithValidations = finalizarTostionSchema
  .refine((data) => {
    // Validar que la merma sea razonable (entre 10% y 25%)
    // Nota: necesitaríamos el peso inicial para esta validación
    // Se puede hacer en el backend con el contexto completo
    return true
  })

// Esquema para lote de café tostado
export const loteCafeTostadoSchema = z.object({
  procesoToscionId: z.string().cuid(),
  codigoLote: lotCodeSchema,
  cantidadKg: weightSchema,
  cantidadDisponible: weightSchema,
  ubicacionAlmacen: z.string().optional(),
  
  nivelTostion: nivelTostionSchema,
  fechaTostado: z.date(),
  fechaVencimiento: z.date(),
  perfilSabor: z.string().optional(), // JSON con notas de sabor
  
  // Trazabilidad
  origenCompleto: z.string(),
  tipoCafe: z.string(),
  variedad: z.string(),
  origen: z.string(),
})

// Esquema para búsqueda y filtros
export const tostionFiltersSchema = z.object({
  operadorId: z.string().cuid().optional(),
  perfilToscionId: z.string().cuid().optional(),
  estado: estadoProcesoSchema.optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
  nivelTostion: nivelTostionSchema.optional(),
  lotePergaminoId: z.string().cuid().optional(),
  variedad: z.string().optional(),
  origen: z.string().optional(),
  mermaMinima: z.number().min(0).max(50).optional(),
  mermaMaxima: z.number().min(0).max(50).optional(),
  search: z.string().optional()
})

// Esquema para comparación de perfiles
export const compararPerfilesSchema = z.object({
  perfilIds: z.array(z.string().cuid()).min(2).max(5),
  incluirDatos: z.boolean().default(true),
  incluirEventos: z.boolean().default(true)
})

// Esquema para análisis de curva de tostión
export const analyzeRoastCurveSchema = z.object({
  procesoToscionId: z.string().cuid(),
  incluirRoR: z.boolean().default(true),
  incluirEventos: z.boolean().default(true),
  incluirAjustes: z.boolean().default(true)
})

// Types derivados
export type PerfilTostionInput = z.infer<typeof perfilTostionSchema>
export type CreatePerfilTostionInput = z.infer<typeof perfilTostionSchemaWithValidations>
export type ProcesoTostionInput = z.infer<typeof procesoTostionSchema>
export type DatoTostionInput = z.infer<typeof datoTostionSchema>
export type EventoTostionInput = z.infer<typeof eventoTostionSchema>
export type AjusteTostionInput = z.infer<typeof ajusteTostionSchema>
export type FinalizarTostionInput = z.infer<typeof finalizarTostionSchema>
export type LoteCafeTostadoInput = z.infer<typeof loteCafeTostadoSchema>
export type TostionFilters = z.infer<typeof tostionFiltersSchema>
export type CompararPerfiles = z.infer<typeof compararPerfilesSchema>
export type AnalyzeRoastCurve = z.infer<typeof analyzeRoastCurveSchema>