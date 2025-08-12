import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases CSS de Tailwind de manera inteligente
 * Evita conflictos y duplicados
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como moneda colombiana
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formatea un peso en kilogramos
 */
export function formatWeight(kg: number, decimals: number = 2): string {
  return `${kg.toFixed(decimals)} kg`
}

/**
 * Formatea un porcentaje
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formatea una fecha en formato colombiano
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Formatea una fecha y hora
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Calcula el porcentaje de rendimiento
 */
export function calculateYield(initial: number, final: number): number {
  if (initial === 0) return 0
  return (final / initial) * 100
}

/**
 * Calcula la merma
 */
export function calculateWaste(initial: number, final: number): number {
  if (initial === 0) return 0
  return ((initial - final) / initial) * 100
}

/**
 * Genera un código de lote único
 */
export function generateLotCode(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
}

/**
 * Calcula días entre fechas
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Verifica si una fecha está próxima a vencer
 */
export function isNearExpiration(expirationDate: Date, warningDays: number = 7): boolean {
  const today = new Date()
  const daysUntilExpiration = daysBetween(today, expirationDate)
  return daysUntilExpiration <= warningDays && expirationDate > today
}

/**
 * Verifica si una fecha ya venció
 */
export function isExpired(expirationDate: Date): boolean {
  return expirationDate < new Date()
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalize(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Convierte enum a opciones para select
 */
export function enumToOptions(enumObject: Record<string, string>, labelMap?: Record<string, string>) {
  return Object.entries(enumObject).map(([key, value]) => ({
    value,
    label: labelMap?.[value] || capitalize(value.replace(/_/g, ' '))
  }))
}

/**
 * Debounce function para optimizar búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Valida si un email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Genera colores para gráficos basados en índice
 */
export function getChartColor(index: number): string {
  const colors = [
    '#8B4513', // Brown
    '#D2691E', // Chocolate
    '#CD853F', // Peru
    '#DEB887', // BurlyWood
    '#F4A460', // SandyBrown
    '#BC8F8F', // RosyBrown
    '#A0522D', // Sienna
    '#8B7355', // Dark Khaki
  ]
  return colors[index % colors.length]
}

/**
 * Convierte minutos a formato MM:SS
 */
export function formatTime(totalMinutes: number): string {
  const minutes = Math.floor(totalMinutes)
  const seconds = Math.round((totalMinutes - minutes) * 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Calcula Rate of Rise (RoR) para tostión
 */
export function calculateRoR(currentTemp: number, previousTemp: number, timeInterval: number = 1): number {
  return (currentTemp - previousTemp) / timeInterval
}