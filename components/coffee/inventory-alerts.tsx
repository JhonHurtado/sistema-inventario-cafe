"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertTriangle,
  Calendar,
  Package,
  TrendingDown,
  X,
  Eye,
  Bell
} from "lucide-react"
import { formatWeight, formatDate, isNearExpiration, isExpired } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface StockAlert {
  id: string
  type: 'LOW_STOCK' | 'EXPIRING' | 'EXPIRED' | 'OUT_OF_STOCK'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  productName: string
  currentStock?: number
  minStock?: number
  expirationDate?: Date
  lotCode?: string
  location?: string
  actionRequired: boolean
}

interface InventoryAlertsProps {
  alerts: StockAlert[]
  onDismissAlert?: (alertId: string) => void
  onViewDetails?: (alertId: string) => void
  className?: string
}

const alertConfig = {
  LOW_STOCK: {
    icon: TrendingDown,
    variant: 'warning' as const,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200'
  },
  EXPIRING: {
    icon: Calendar,
    variant: 'warning' as const,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200'
  },
  EXPIRED: {
    icon: AlertTriangle,
    variant: 'destructive' as const,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  },
  OUT_OF_STOCK: {
    icon: Package,
    variant: 'destructive' as const,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  }
}

const severityConfig = {
  low: {
    badge: 'Baja',
    badgeVariant: 'secondary' as const
  },
  medium: {
    badge: 'Media',
    badgeVariant: 'warning' as const
  },
  high: {
    badge: 'Alta',
    badgeVariant: 'destructive' as const
  },
  critical: {
    badge: 'Crítica',
    badgeVariant: 'destructive' as const
  }
}

export function InventoryAlerts({
  alerts,
  onDismissAlert,
  onViewDetails,
  className
}: InventoryAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)
  
  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id))
  const criticalAlerts = visibleAlerts.filter(alert => alert.severity === 'critical')
  const highAlerts = visibleAlerts.filter(alert => alert.severity === 'high')
  const otherAlerts = visibleAlerts.filter(alert => !['critical', 'high'].includes(alert.severity))
  
  const displayedAlerts = showAll ? visibleAlerts : [...criticalAlerts, ...highAlerts].slice(0, 5)
  
  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
    onDismissAlert?.(alertId)
  }
  
  if (visibleAlerts.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay alertas de inventario</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas de Inventario
            {visibleAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {visibleAlerts.length}
              </Badge>
            )}
          </CardTitle>
          
          {visibleAlerts.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Mostrar menos' : `Ver todas (${visibleAlerts.length})`}
            </Button>
          )}
        </div>
        
        {/* Resumen de alertas por severidad */}
        <div className="flex gap-2">
          {criticalAlerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalAlerts.length} Críticas
            </Badge>
          )}
          {highAlerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {highAlerts.length} Altas
            </Badge>
          )}
          {otherAlerts.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {otherAlerts.length} Otras
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {displayedAlerts.map((alert) => {
          const config = alertConfig[alert.type]
          const severityInfo = severityConfig[alert.severity]
          const Icon = config.icon
          
          return (
            <Alert 
              key={alert.id}
              variant={config.variant}
              className={cn(
                "relative",
                config.bgColor
              )}
            >
              <Icon className="h-4 w-4" />
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <AlertTitle className="flex items-center gap-2">
                      {alert.title}
                      <Badge variant={severityInfo.badgeVariant} className="text-xs">
                        {severityInfo.badge}
                      </Badge>
                    </AlertTitle>
                    
                    <AlertDescription className="mt-1">
                      {alert.description}
                    </AlertDescription>
                    
                    {/* Información adicional */}
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">{alert.productName}</span>
                      
                      {alert.lotCode && (
                        <span>Lote: {alert.lotCode}</span>
                      )}
                      
                      {alert.location && (
                        <span>Ubicación: {alert.location}</span>
                      )}
                      
                      {alert.currentStock !== undefined && (
                        <span>Stock: {formatWeight(alert.currentStock)}</span>
                      )}
                      
                      {alert.minStock !== undefined && (
                        <span>Mínimo: {formatWeight(alert.minStock)}</span>
                      )}
                      
                      {alert.expirationDate && (
                        <span>Vence: {formatDate(alert.expirationDate)}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex items-start gap-1 ml-2">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(alert.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(alert.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Alert>
          )
        })}
        
        {!showAll && visibleAlerts.length > 5 && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
              className="text-muted-foreground"
            >
              Ver {visibleAlerts.length - 5} alertas más
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Hook para generar alertas basadas en datos de inventario
export function useInventoryAlerts() {
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  
  const generateAlerts = (inventoryData: any) => {
    const newAlerts: StockAlert[] = []
    
    // Ejemplo de generación de alertas
    // Esto se conectaría con los datos reales del inventario
    
    return newAlerts
  }
  
  return {
    alerts,
    generateAlerts,
    dismissAlert: (alertId: string) => {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    }
  }
}