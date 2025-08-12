import { z } from 'zod'
import {
  emailSchema,
  phoneSchema,
  positiveNumberSchema,
  weightSchema,
  qualityScoreSchema,
  lotCodeSchema,
  percentageSchema,
  estadoCompraSchema
} from './common'

// Esquema para proveedor
export const proveedorSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  contacto: z.string().optional(),
  telefono: phoneSchema.optional(),
  email: emailSchema.optional(),
  direccion: z.string().optional(),
  tipoProveedor: z.enum(['Cooperativa', 'Finca', 'Comercializador']),
  certificaciones: z.array(z.string()).optional(),
  calificacion: z.number().min(1).max(10).optional(),
})

// Esquema para crear proveedor
export const createProveedorSchema = proveedorSchema

// Esquema para actualizar proveedor
export const updateProveedorSchema = proveedorSchema.partial().extend({
  id: z.string().cuid(),
  isActive: z.boolean().optional()
})

// Esquema para compra
export const compraSchema = z.object({
  numeroFactura: z.string().min(1, 'El número de factura es requerido'),
  proveedorId: z.string().cuid('ID de proveedor inválido'),
  fechaCompra: z.date(),
  fechaVencimiento: z.date().optional(),
  
  // Información del café
  tipoCafe: z.string().min(1, 'El tipo de café es requerido'),
  variedad: z.string().min(1, 'La variedad es requerida'),
  origen: z.string().min(1, 'El origen es requerido'),
  procesosBeneficio: z.enum(['Lavado', 'Natural', 'Honey', 'Semi-lavado']),
  
  // Cantidades y precios
  cantidadKg: weightSchema,
  precioKg: positiveNumberSchema,
  precioTotal: positiveNumberSchema,
  numeroSacos: z.number().int().positive().optional(),
  
  // Control de calidad
  humedad: percentageSchema.optional(),
  calidad: qualityScoreSchema.optional(),
  defectos: z.string().optional(),
  
  // Certificaciones
  esOrganico: z.boolean().default(false),
  esFairTrade: z.boolean().default(false),
  certificaciones: z.array(z.string()).optional(),
  
  // Documentación
  documentos: z.array(z.string()).optional(),
  observaciones: z.string().optional(),
  
  // Código de lote
  codigoLote: lotCodeSchema.optional(), // Se genera automáticamente si no se proporciona
})

// Validaciones personalizadas
export const compraSchemaWithValidations = compraSchema
  .refine((data) => {
    // Validar que el precio total coincida con cantidad * precio por kg
    const calculatedTotal = data.cantidadKg * data.precioKg
    return Math.abs(data.precioTotal - calculatedTotal) < 0.01
  }, {
    message: 'El precio total debe coincidir con cantidad × precio por kg',
    path: ['precioTotal']
  })
  .refine((data) => {
    // Validar que la fecha de vencimiento sea posterior a la fecha de compra
    if (data.fechaVencimiento) {
      return data.fechaVencimiento > data.fechaCompra
    }
    return true
  }, {
    message: 'La fecha de vencimiento debe ser posterior a la fecha de compra',
    path: ['fechaVencimiento']
  })

// Esquema para crear compra
export const createCompraSchema = compraSchemaWithValidations.extend({
  compradorId: z.string().cuid('ID de comprador inválido'),
})

// Esquema para actualizar compra
export const updateCompraSchema = compraSchemaWithValidations.partial().extend({
  id: z.string().cuid(),
  estado: estadoCompraSchema.optional()
})

// Esquema para recepción de compra (cambio de estado)
export const receiveCompraSchema = z.object({
  id: z.string().cuid(),
  estado: z.literal('RECIBIDA'),
  observacionesRecepcion: z.string().optional(),
  fechaRecepcion: z.date().optional()
})

// Esquema para control de calidad
export const qualityControlSchema = z.object({
  id: z.string().cuid(),
  humedad: percentageSchema,
  calidad: qualityScoreSchema,
  defectos: z.string().optional(),
  aprobado: z.boolean(),
  observacionesCalidad: z.string().optional(),
  fechaControl: z.date().optional()
})

// Esquema para búsqueda y filtros de compras
export const compraFiltersSchema = z.object({
  proveedorId: z.string().cuid().optional(),
  estado: estadoCompraSchema.optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
  tipoCafe: z.string().optional(),
  variedad: z.string().optional(),
  origen: z.string().optional(),
  esOrganico: z.boolean().optional(),
  esFairTrade: z.boolean().optional(),
  calidadMinima: qualityScoreSchema.optional(),
  cantidadMinima: weightSchema.optional(),
  cantidadMaxima: weightSchema.optional(),
  search: z.string().optional() // Búsqueda general
})

// Types derivados de los esquemas
export type ProveedorInput = z.infer<typeof proveedorSchema>
export type CreateProveedorInput = z.infer<typeof createProveedorSchema>
export type UpdateProveedorInput = z.infer<typeof updateProveedorSchema>
export type CompraInput = z.infer<typeof compraSchema>
export type CreateCompraInput = z.infer<typeof createCompraSchema>
export type UpdateCompraInput = z.infer<typeof updateCompraSchema>
export type ReceiveCompraInput = z.infer<typeof receiveCompraSchema>
export type QualityControlInput = z.infer<typeof qualityControlSchema>
export type CompraFilters = z.infer<typeof compraFiltersSchema>