import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "./status-badge"
import { QualityIndicators } from "./coffee-grade-indicator"
import { formatWeight, formatCurrency, formatPercentage } from "@/lib/utils"
import {
  ShoppingCart,
  Wheat,
  Flame,
  Package,
  MapPin,
  Calendar,
  User,
  TrendingDown
} from "lucide-react"

interface TraceabilityStep {
  id: string
  type: 'compra' | 'trilla' | 'tostion' | 'empacado'
  title: string
  date: Date
  operator?: string
  status: string
  data: any
  location?: string
}

interface TraceabilityTimelineProps {
  steps: TraceabilityStep[]
  className?: string
}

const stepIcons = {
  compra: ShoppingCart,
  trilla: Wheat,
  tostion: Flame,
  empacado: Package
}

const stepColors = {
  compra: "bg-blue-500",
  trilla: "bg-green-500",
  tostion: "bg-orange-500",
  empacado: "bg-purple-500"
}

export function TraceabilityTimeline({ steps, className }: TraceabilityTimelineProps) {
  const renderStepContent = (step: TraceabilityStep) => {
    switch (step.type) {
      case 'compra':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Proveedor:</span>
                <p className="text-muted-foreground">{step.data.proveedor}</p>
              </div>
              <div>
                <span className="font-medium">Origen:</span>
                <p className="text-muted-foreground">{step.data.origen}</p>
              </div>
              <div>
                <span className="font-medium">Variedad:</span>
                <p className="text-muted-foreground">{step.data.variedad}</p>
              </div>
              <div>
                <span className="font-medium">Cantidad:</span>
                <p className="text-muted-foreground">{formatWeight(step.data.cantidad)}</p>
              </div>
              <div>
                <span className="font-medium">Precio:</span>
                <p className="text-muted-foreground">{formatCurrency(step.data.precio)}</p>
              </div>
              <div>
                <span className="font-medium">Humedad:</span>
                <p className="text-muted-foreground">{formatPercentage(step.data.humedad)}</p>
              </div>
            </div>
            {step.data.calidad && (
              <QualityIndicators
                indicators={[{ label: "Calidad", value: step.data.calidad, max: 10 }]}
                size="sm"
              />
            )}
            {step.data.certificaciones && step.data.certificaciones.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {step.data.certificaciones.map((cert: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )

      case 'trilla':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Cantidad inicial:</span>
                <p className="text-muted-foreground">{formatWeight(step.data.cantidadInicial)}</p>
              </div>
              <div>
                <span className="font-medium">Pergamino obtenido:</span>
                <p className="text-muted-foreground">{formatWeight(step.data.cantidadPergamino)}</p>
              </div>
              <div>
                <span className="font-medium">Primera:</span>
                <p className="text-muted-foreground">{formatWeight(step.data.cantidadPrimera)}</p>
              </div>
              <div>
                <span className="font-medium">Segunda:</span>
                <p className="text-muted-foreground">{formatWeight(step.data.cantidadSegunda)}</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="font-medium">Merma:</span>
                <p className="text-muted-foreground">{formatPercentage(step.data.porcentajeMerma)}</p>
              </div>
              <div>
                <span className="font-medium">Rendimiento:</span>
                <p className="text-muted-foreground">{formatPercentage(step.data.rendimiento)}</p>
              </div>
            </div>
          </div>
        )

      case 'tostion':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Perfil usado:</span>
                <p className="text-muted-foreground">{step.data.perfilNombre || 'Personalizado'}</p>
              </div>
              <div>
                <span className="font-medium">Nivel de tostión:</span>
                <StatusBadge status={step.data.nivelTostion} />
              </div>
              <div>
                <span className="font-medium">Cantidad inicial:</span>
                <p className="text-muted-foreground">{formatWeight(step.data.cantidadInicial)}</p>
              </div>
              <div>
                <span className="font-medium">Cantidad final:</span>
                <p className="text-muted-foreground">{formatWeight(step.data.cantidadFinal)}</p>
              </div>
              <div>
                <span className="font-medium">Tiempo total:</span>
                <p className="text-muted-foreground">{step.data.tiempoTotal} min</p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="font-medium">Merma:</span>
                <p className="text-muted-foreground">{formatPercentage(step.data.porcentajeMerma)}</p>
              </div>
            </div>
            {step.data.calidad && (
              <QualityIndicators
                indicators={[
                  { label: "Aroma", value: step.data.calidad.aroma, max: 10 },
                  { label: "Acidez", value: step.data.calidad.acidez, max: 10 }
                ]}
                size="sm"
              />
            )}
          </div>
        )

      case 'empacado':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Producto:</span>
                <p className="text-muted-foreground">{step.data.nombreProducto}</p>
              </div>
              <div>
                <span className="font-medium">Tipo empaque:</span>
                <p className="text-muted-foreground">{step.data.tipoEmpaque}</p>
              </div>
              <div>
                <span className="font-medium">Peso por unidad:</span>
                <p className="text-muted-foreground">{step.data.pesoPorUnidad}g</p>
              </div>
              <div>
                <span className="font-medium">Unidades:</span>
                <p className="text-muted-foreground">{step.data.cantidadUnidades}</p>
              </div>
              <div>
                <span className="font-medium">Total empacado:</span>
                <p className="text-muted-foreground">{formatWeight(step.data.cantidadTotal)}</p>
              </div>
              <div>
                <span className="font-medium">Fecha vencimiento:</span>
                <p className="text-muted-foreground">
                  {format(new Date(step.data.fechaVencimiento), "dd/MM/yyyy", { locale: es })}
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={className}>
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = stepIcons[step.type]
            const isLast = index === steps.length - 1
            
            return (
              <div key={step.id} className="relative flex gap-4">
                {/* Icono del paso */}
                <div className={`
                  relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-background
                  ${stepColors[step.type]}
                `}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                {/* Contenido del paso */}
                <div className="flex-1 min-w-0">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(step.date, "dd/MM/yyyy HH:mm", { locale: es })}
                            </div>
                            {step.operator && (
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {step.operator}
                              </div>
                            )}
                            {step.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {step.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={step.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderStepContent(step)}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}