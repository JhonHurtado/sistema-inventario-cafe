import { z } from 'zod'
import {
  weightSchema,
  positiveNumberSchema,
  estadoProcesoSchema,
  tipoEmpaqueSchema,
  lotCodeSchema
} from './common'

// Esquema para proceso de empacado
export const procesoEmpacadoSchema = z.object({
  loteTostadoId: z.string().cuid(),
  operadorId: z.string().cuid(),
  fechaEmpacado: z.date(),
  
  // Configuración del empacado
  tipoEmpaque: tipoEmpaqueSchema,
  pesoPorUnidad: z.number().positive().min(50).max(5000), // gramos
  cantidadUnidades: z.number().int().positive().min(1).max(10000),
  cantidadTotalKg: weightSchema,
  
  // Información de etiquetado
  nombreProducto: z.string().min(2, 'El nombre del producto es requerido'),
  informacionEtiqueta: z.string().optional(), // JSON con info de etiqueta
  codigoBarras: z.string().optional(),
  fechaVencimiento: z.date(),
  
  codigoLoteEmpacado: lotCodeSchema.optional(),
})

// Validaciones para empacado
export const procesoEmpacadoSchemaWithValidations = procesoEmpacadoSchema
  .refine((data) => {
    // Validar que cantidad total coincida con unidades × peso por unidad
    const calculatedTotal = (data.cantidadUnidades * data.pesoPorUnidad) / 1000 // convertir a kg
    return Math.abs(data.cantidadTotalKg - calculatedTotal) < 0.01
  }, {
    message: 'La cantidad total debe coincidir con unidades × peso por unidad',
    path: ['cantidadTotalKg']
  })
  .refine((data) => {
    // Validar que la fecha de vencimiento sea futura
    return data.fechaVencimiento > data.fechaEmpacado
  }, {
    message: 'La fecha de vencimiento debe ser posterior al empacado',
    path: ['fechaVencimiento']
  })

// Esquema para producto terminado
export const productoTerminadoSchema = z.object({
  procesoEmpacadoId: z.string().cuid(),
  codigoProducto: lotCodeSchema,
  codigoBarras: z.string().optional(),
  
  // Información del producto
  nombreProducto: z.string().min(2),
  tipoEmpaque: tipoEmpaqueSchema,
  pesoPorUnidad: z.number().positive(), // gramos
  cantidadUnidades: z.number().int().positive(),
  cantidadDisponible: z.number().int().min(0),
  
  // Información comercial
  precioVenta: positiveNumberSchema.optional(),
  costoProduccion: positiveNumberSchema.optional(),
  margen: z.number().min(0).max(100).optional(), // porcentaje
  
  // Fechas
  fechaProduccion: z.date(),
  fechaVencimiento: z.date(),
  
  // Ubicación
  ubicacionAlmacen: z.string().optional(),
  
  // Trazabilidad
  trazabilidadCompleta: z.string(), // JSON con toda la cadena
})

// Esquema para etiqueta de producto
export const etiquetaProductoSchema = z.object({
  nombreProducto: z.string().min(2),
  descripcion: z.string().optional(),
  
  // Información del café
  origen: z.string(),
  variedad: z.string(),
  procesosBeneficio: z.string(),
  nivelTostion: z.string(),
  
  // Notas de cata
  perfilSabor: z.object({
    notas: z.array(z.string()),
    acidez: z.number().int().min(1).max(10),
    cuerpo: z.number().int().min(1).max(10),
    dulzor: z.number().int().min(1).max(10),
    balance: z.number().int().min(1).max(10),
  }).optional(),
  
  // Información de preparación
  metodoPreparacion: z.array(z.string()).optional(),
  dosisRecomendada: z.string().optional(),
  temperaturaAgua: z.string().optional(),
  
  // Información empresarial
  nombreEmpresa: z.string(),
  direccionEmpresa: z.string(),
  telefonoEmpresa: z.string().optional(),
  webEmpresa: z.string().optional(),
  
  // Información legal
  registroSanitario: z.string().optional(),
  contenidoNeto: z.string(),
  fechaVencimiento: z.date(),
  loteProduccion: z.string(),
  
  // Certificaciones
  certificaciones: z.array(z.string()).optional(),
  
  // Código de barras y QR
  codigoBarras: z.string().optional(),
  codigoQR: z.string().optional(),
})

// Esquema para actualizar stock de producto terminado
export const updateProductStockSchema = z.object({
  id: z.string().cuid(),
  cantidadDisponible: z.number().int().min(0),
  ubicacionAlmacen: z.string().optional(),
  observaciones: z.string().optional()
})

// Esquema para salida/venta de producto
export const salidaProductoSchema = z.object({
  productoId: z.string().cuid(),
  cantidadSalida: z.number().int().positive(),
  motivo: z.enum(['VENTA', 'MUESTRA', 'PERDIDA', 'VENCIMIENTO', 'OTRO']),
  observaciones: z.string().optional(),
  operadorId: z.string().cuid(),
  fechaSalida: z.date().optional()
})

// Esquema para configuración de empacado
export const configuracionEmpacadoSchema = z.object({
  tiposEmpaque: z.array(z.object({
    tipo: tipoEmpaqueSchema,
    label: z.string(),
    pesosDisponibles: z.array(z.number().positive()), // en gramos
    isDefault: z.boolean().default(false)
  })),
  
  diasVencimientoDefault: z.number().int().positive().default(30),
  
  plantillaEtiqueta: z.object({
    incluirQR: z.boolean().default(true),
    incluirCodigoBarras: z.boolean().default(true),
    incluirPerfilSabor: z.boolean().default(true),
    incluirMetodoPreparacion: z.boolean().default(true),
    disenoPersonalizado: z.string().optional()
  }).optional()
})

// Esquema para filtros de búsqueda
export const empacadoFiltersSchema = z.object({
  operadorId: z.string().cuid().optional(),
  estado: estadoProcesoSchema.optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
  tipoEmpaque: tipoEmpaqueSchema.optional(),
  loteTostadoId: z.string().cuid().optional(),
  nombreProducto: z.string().optional(),
  pesoPorUnidad: z.number().positive().optional(),
  proximosVencer: z.boolean().optional(), // próximos a vencer
  stockBajo: z.boolean().optional(),
  search: z.string().optional()
})

// Esquema para reporte de producción
export const reporteProduccionSchema = z.object({
  fechaDesde: z.date(),
  fechaHasta: z.date(),
  operadorId: z.string().cuid().optional(),
  tipoEmpaque: tipoEmpaqueSchema.optional(),
  agruparPor: z.enum(['DIA', 'SEMANA', 'MES', 'OPERADOR', 'TIPO_EMPAQUE']).default('DIA')
})

// Esquema para generar código QR
export const generateQRSchema = z.object({
  productoId: z.string().cuid(),
  incluirTrazabilidad: z.boolean().default(true),
  incluirInformacionProducto: z.boolean().default(true),
  tamano: z.enum(['SMALL', 'MEDIUM', 'LARGE']).default('MEDIUM')
})

// Types derivados
export type ProcesoEmpacadoInput = z.infer<typeof procesoEmpacadoSchema>
export type CreateProcesoEmpacadoInput = z.infer<typeof procesoEmpacadoSchemaWithValidations>
export type ProductoTerminadoInput = z.infer<typeof productoTerminadoSchema>
export type EtiquetaProductoInput = z.infer<typeof etiquetaProductoSchema>
export type UpdateProductStockInput = z.infer<typeof updateProductStockSchema>
export type SalidaProductoInput = z.infer<typeof salidaProductoSchema>
export type ConfiguracionEmpacadoInput = z.infer<typeof configuracionEmpacadoSchema>
export type EmpacadoFilters = z.infer<typeof empacadoFiltersSchema>
export type ReporteProduccion = z.infer<typeof reporteProduccionSchema>
export type GenerateQRInput = z.infer<typeof generateQRSchema>