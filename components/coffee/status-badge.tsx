import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusConfig = {
  // Estados de compra
  PENDIENTE: { variant: "warning" as const, label: "Pendiente" },
  RECIBIDA: { variant: "success" as const, label: "Recibida" },
  CONTROLADA: { variant: "info" as const, label: "Controlada" },
  RECHAZADA: { variant: "destructive" as const, label: "Rechazada" },
  
  // Estados de lote
  DISPONIBLE: { variant: "success" as const, label: "Disponible" },
  EN_PROCESO: { variant: "warning" as const, label: "En Proceso" },
  AGOTADO: { variant: "secondary" as const, label: "Agotado" },
  VENCIDO: { variant: "destructive" as const, label: "Vencido" },
  
  // Estados de proceso
  EN_PROGRESO: { variant: "warning" as const, label: "En Progreso" },
  COMPLETADO: { variant: "success" as const, label: "Completado" },
  CANCELADO: { variant: "destructive" as const, label: "Cancelado" },
  
  // Clasificaciones de café
  PERGAMINO: { variant: "coffee" as const, label: "Pergamino" },
  PRIMERA: { variant: "success" as const, label: "Primera" },
  SEGUNDA: { variant: "warning" as const, label: "Segunda" },
  
  // Niveles de tostión
  LIGHT: { variant: "outline" as const, label: "Clara" },
  MEDIUM_LIGHT: { variant: "secondary" as const, label: "Media Clara" },
  MEDIUM: { variant: "coffee" as const, label: "Media" },
  MEDIUM_DARK: { variant: "default" as const, label: "Media Oscura" },
  DARK: { variant: "destructive" as const, label: "Oscura" },
  
  // Estados de producto
  RESERVADO: { variant: "warning" as const, label: "Reservado" },
  VENDIDO: { variant: "secondary" as const, label: "Vendido" },
  DAÑADO: { variant: "destructive" as const, label: "Dañado" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    variant: "outline" as const,
    label: status
  }

  return (
    <Badge
      variant={config.variant}
      className={cn("text-xs font-medium", className)}
    >
      {config.label}
    </Badge>
  )
}

// Función helper para obtener el color de estado
export function getStatusColor(status: string): string {
  const config = statusConfig[status as keyof typeof statusConfig]
  
  switch (config?.variant) {
    case "success":
      return "text-green-600"
    case "warning":
      return "text-yellow-600"
    case "destructive":
      return "text-red-600"
    case "info":
      return "text-blue-600"
    case "coffee":
      return "text-coffee-600"
    default:
      return "text-gray-600"
  }
}