import { z } from 'zod'

// Esquemas comunes reutilizables

export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('Formato de email inválido')

export const phoneSchema = z
  .string()
  .min(10, 'El teléfono debe tener al menos 10 dígitos')
  .regex(/^[+]?[0-9\s-()]+$/, 'Formato de teléfono inválido')

export const positiveNumberSchema = z
  .number()
  .positive('Debe ser un número positivo')

export const percentageSchema = z
  .number()
  .min(0, 'El porcentaje no puede ser negativo')
  .max(100, 'El porcentaje no puede ser mayor a 100')

export const weightSchema = z
  .number()
  .positive('El peso debe ser positivo')
  .min(0.1, 'El peso mínimo es 0.1 kg')

export const temperatureSchema = z
  .number()
  .min(0, 'La temperatura no puede ser negativa')
  .max(300, 'La temperatura no puede ser mayor a 300°C')

export const qualityScoreSchema = z
  .number()
  .int('La calidad debe ser un número entero')
  .min(1, 'La calidad mínima es 1')
  .max(10, 'La calidad máxima es 10')

export const lotCodeSchema = z
  .string()
  .min(5, 'El código de lote debe tener al menos 5 caracteres')
  .max(50, 'El código de lote no puede exceder 50 caracteres')
  .regex(/^[A-Z0-9-_]+$/, 'El código de lote solo puede contener letras mayúsculas, números, guiones y guiones bajos')

// Enum validations
export const userRoleSchema = z.enum(['ADMIN', 'MANAGER', 'OPERATOR', 'USER'])
export const estadoCompraSchema = z.enum(['PENDIENTE', 'RECIBIDA', 'CONTROLADA', 'RECHAZADA'])
export const estadoLoteSchema = z.enum(['DISPONIBLE', 'EN_PROCESO', 'AGOTADO', 'VENCIDO'])
export const estadoProcesoSchema = z.enum(['EN_PROGRESO', 'COMPLETADO', 'CANCELADO'])
export const clasificacionCafeSchema = z.enum(['PERGAMINO', 'PRIMERA', 'SEGUNDA'])
export const nivelTostionSchema = z.enum(['LIGHT', 'MEDIUM_LIGHT', 'MEDIUM', 'MEDIUM_DARK', 'DARK'])
export const tipoEmpaqueSchema = z.enum(['BOLSA_VALVE', 'BOLSA_SIMPLE', 'FRASCO_VIDRIO', 'LATA', 'OTRO'])
export const tipoEventoTostionSchema = z.enum([
  'FIRST_CRACK_INICIO',
  'FIRST_CRACK_FINAL', 
  'SECOND_CRACK_INICIO',
  'SECOND_CRACK_FINAL',
  'INICIO_ENFRIAMIENTO',
  'DESCARGA'
])
export const tipoAjusteTostionSchema = z.enum(['FLUJO_AIRE', 'NIVEL_GAS', 'TEMPERATURA'])

// Validation helpers
export function validateCUID(value: string) {
  return z.string().cuid().safeParse(value).success
}

export function validateDate(value: any) {
  const date = new Date(value)
  return !isNaN(date.getTime())
}

export function validateFutureDate(value: any) {
  const date = new Date(value)
  return date > new Date()
}

export function validatePastDate(value: any) {
  const date = new Date(value)
  return date <= new Date()
}

// Custom error messages
export const errorMessages = {
  required: 'Este campo es requerido',
  email: 'Formato de email inválido',
  phone: 'Formato de teléfono inválido',
  positiveNumber: 'Debe ser un número positivo',
  invalidDate: 'Fecha inválida',
  futureDate: 'La fecha debe ser futura',
  pastDate: 'La fecha debe ser pasada o presente',
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `No puede exceder ${max} caracteres`,
  minValue: (min: number) => `El valor mínimo es ${min}`,
  maxValue: (max: number) => `El valor máximo es ${max}`,
}