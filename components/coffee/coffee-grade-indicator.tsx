import { cn } from "@/lib/utils"

interface CoffeeGradeIndicatorProps {
  grade: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function CoffeeGradeIndicator({
  grade,
  size = "md",
  showLabel = true,
  className
}: CoffeeGradeIndicatorProps) {
  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "bg-green-500"
    if (grade >= 8) return "bg-green-400"
    if (grade >= 7) return "bg-yellow-500"
    if (grade >= 6) return "bg-orange-500"
    if (grade >= 5) return "bg-red-400"
    return "bg-red-500"
  }

  const getGradeText = (grade: number) => {
    if (grade >= 9) return "Excelente"
    if (grade >= 8) return "Muy Bueno"
    if (grade >= 7) return "Bueno"
    if (grade >= 6) return "Aceptable"
    if (grade >= 5) return "Regular"
    return "Deficiente"
  }

  const sizeClasses = {
    sm: "w-16 h-2",
    md: "w-20 h-3",
    lg: "w-24 h-4"
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative rounded-full bg-gray-200 overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full transition-all duration-300",
            getGradeColor(grade)
          )}
          style={{ width: `${(grade / 10) * 100}%` }}
        />
      </div>
      
      {showLabel && (
        <div className={cn("flex items-center gap-1", textSizeClasses[size])}>
          <span className="font-semibold">{grade.toFixed(1)}</span>
          <span className="text-muted-foreground">({getGradeText(grade)})</span>
        </div>
      )}
    </div>
  )
}

// Componente para mostrar múltiples indicadores de calidad
interface QualityIndicatorsProps {
  indicators: {
    label: string
    value: number
    max?: number
  }[]
  size?: "sm" | "md" | "lg"
  className?: string
}

export function QualityIndicators({
  indicators,
  size = "md",
  className
}: QualityIndicatorsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {indicators.map((indicator, index) => {
        const normalizedValue = indicator.max 
          ? (indicator.value / indicator.max) * 10
          : indicator.value
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className={cn(
                "font-medium text-muted-foreground",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base"
              )}>
                {indicator.label}
              </span>
              <span className={cn(
                "font-semibold",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base"
              )}>
                {indicator.value}{indicator.max && `/${indicator.max}`}
              </span>
            </div>
            <CoffeeGradeIndicator
              grade={normalizedValue}
              size={size}
              showLabel={false}
            />
          </div>
        )
      })}
    </div>
  )
}