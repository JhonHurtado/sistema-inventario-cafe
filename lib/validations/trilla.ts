import { z } from 'zod'
import {
  weightSchema,
  percentageSchema,
  estadoProcesoSchema,
  clasificacionCafeSchema,
  lotCodeSchema
} from './common'

// Esquema para proceso de trilla
export const procesoTrillaSchema = z.object({
  loteVerdeId: z.string().cuid('ID de lote verde inválido'),
  operadorId: z.string().cuid('ID de operador inválido'),
  fechaProceso: z.date(),
  
  // Cantidades
  cantidadInicialKg: weightSchema,
  cantidadPergaminoKg: weightSchema,
  cantidadPrimeraKg: weightSchema,
  cantidadSegundaKg: weightSchema,
  cantidadMermaKg: weightSchema,
  
  // Control de calidad
  humedadDespues: percentageSchema.optional(),
  observaciones: z.string().optional(),
  
  // Código de lote resultante
  codigoLotePergamino: lotCodeSchema.optional(), // Se genera automáticamente si no se proporciona
})

// Validaciones personalizadas para trilla
export const procesoTrillaSchemaWithValidations = procesoTrillaSchema
  .refine((data) => {
    // Validar que la suma de productos + merma = cantidad inicial
    const totalProcesado = data.cantidadPergaminoKg + data.cantidadMermaKg
    return Math.abs(totalProcesado - data.cantidadInicialKg) < 0.1 // Tolerancia de 100g
  }, {
    message: 'La suma de pergamino + merma debe igual a la cantidad inicial',
    path: ['cantidadPergaminoKg']
  })
  .refine((data) => {
    // Validar que primera + segunda = pergamino
    const totalClasificado = data.cantidadPrimeraKg + data.cantidadSegundaKg
    return Math.abs(totalClasificado - data.cantidadPergaminoKg) < 0.1 // Tolerancia de 100g
  }, {
    message: 'La suma de primera + segunda debe igual al pergamino total',
    path: ['cantidadPrimeraKg']
  })
  .refine((data) => {
    // Validar que la merma sea razonable (entre 5% y 40%)
    const porcentajeMerma = (data.cantidadMermaKg / data.cantidadInicialKg) * 100
    return porcentajeMerma >= 5 && porcentajeMerma <= 40
  }, {
    message: 'El porcentaje de merma debe estar entre 5% y 40%',
    path: ['cantidadMermaKg']
  })

// Esquema para crear proceso de trilla
export const createProcesoTrillaSchema = procesoTrillaSchemaWithValidations

// Esquema para actualizar proceso de trilla
export const updateProcesoTrillaSchema = procesoTrillaSchemaWithValidations.partial().extend({
  id: z.string().cuid(),
  estado: estadoProcesoSchema.optional()
})

// Esquema para lote de café pergamino
export const loteCafePergaminoSchema = z.object({
  procesoTrillaId: z.string().cuid(),
  codigoLote: lotCodeSchema,
  clasificacion: clasificacionCafeSchema,
  cantidadKg: weightSchema,
  cantidadDisponible: weightSchema,
  ubicacionAlmacen: z.string().optional(),
  
  // Datos heredados
  origenTrilla: z.string(),
  tipoCafe: z.string(),
  variedad: z.string(),
  origen: z.string(),
  humedad: percentageSchema.optional(),
  calidad: z.number().int().min(1).max(10).optional(),
  
  fechaProceso: z.date(),
  fechaVencimiento: z.date().optional(),
})

// Esquema para actualizar stock de pergamino
export const updatePergaminoStockSchema = z.object({
  id: z.string().cuid(),
  cantidadDisponible: weightSchema,
  ubicacionAlmacen: z.string().optional(),
  observaciones: z.string().optional()
})

// Esquema para transferencia de pergamino
export const transferPergaminoSchema = z.object({
  loteOrigenId: z.string().cuid(),
  cantidadTransferir: weightSchema,
  ubicacionDestino: z.string(),
  motivo: z.string(),
  operadorId: z.string().cuid()
})

// Esquema para filtros de búsqueda
export const trillaFiltersSchema = z.object({
  operadorId: z.string().cuid().optional(),
  estado: estadoProcesoSchema.optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
  loteVerdeId: z.string().cuid().optional(),
  clasificacion: clasificacionCafeSchema.optional(),
  rendimientoMinimo: percentageSchema.optional(),
  rendimientoMaximo: percentageSchema.optional(),
  search: z.string().optional()
})

// Esquema para análisis de rendimiento
export const rendimientoAnalysisSchema = z.object({
  fechaDesde: z.date(),
  fechaHasta: z.date(),
  proveedorId: z.string().cuid().optional(),
  variedad: z.string().optional(),
  operadorId: z.string().cuid().optional()
})

// Esquema para cálculo automático de cantidades
export const calculateTrillaSchema = z.object({
  cantidadInicial: weightSchema,
  rendimientoPergamino: percentageSchema, // Porcentaje esperado de pergamino
  rendimientoPrimera: percentageSchema,   // Porcentaje de primera del pergamino
  rendimientoSegunda: percentageSchema,   // Porcentaje de segunda del pergamino
})

// Validación para verificar disponibilidad de lote verde
export const verifyGreenLotAvailabilitySchema = z.object({
  loteVerdeId: z.string().cuid(),
  cantidadRequerida: weightSchema
})

// Types derivados de los esquemas
export type ProcesoTrillaInput = z.infer<typeof procesoTrillaSchema>
export type CreateProcesoTrillaInput = z.infer<typeof createProcesoTrillaSchema>
export type UpdateProcesoTrillaInput = z.infer<typeof updateProcesoTrillaSchema>
export type LoteCafePergaminoInput = z.infer<typeof loteCafePergaminoSchema>
export type UpdatePergaminoStockInput = z.infer<typeof updatePergaminoStockSchema>
export type TransferPergaminoInput = z.infer<typeof transferPergaminoSchema>
export type TrillaFilters = z.infer<typeof trillaFiltersSchema>
export type RendimientoAnalysis = z.infer<typeof rendimientoAnalysisSchema>
export type CalculateTrilla = z.infer<typeof calculateTrillaSchema>
export type VerifyGreenLotAvailability = z.infer<typeof verifyGreenLotAvailabilitySchema>