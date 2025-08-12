"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  ScatterChart,
  Scatter
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatTime } from "@/lib/utils"
import { Flame, Clock, Thermometer } from "lucide-react"

interface RoastingDataPoint {
  time: number // en minutos
  temperature: number
  ror?: number // Rate of Rise
  airflow?: number
  gas?: number
}

interface RoastingEvent {
  time: number
  type: 'FIRST_CRACK_INICIO' | 'FIRST_CRACK_FINAL' | 'SECOND_CRACK_INICIO' | 'SECOND_CRACK_FINAL' | 'DESCARGA'
  temperature: number
  label: string
}

interface RoastingCurveChartProps {
  data: RoastingDataPoint[]
  events?: RoastingEvent[]
  title?: string
  showRoR?: boolean
  showAirflow?: boolean
  showGas?: boolean
  height?: number
  className?: string
}

const eventColors = {
  FIRST_CRACK_INICIO: '#22c55e',
  FIRST_CRACK_FINAL: '#16a34a',
  SECOND_CRACK_INICIO: '#f59e0b',
  SECOND_CRACK_FINAL: '#d97706',
  DESCARGA: '#ef4444'
}

const eventLabels = {
  FIRST_CRACK_INICIO: '1C Start',
  FIRST_CRACK_FINAL: '1C End',
  SECOND_CRACK_INICIO: '2C Start',
  SECOND_CRACK_FINAL: '2C End',
  DESCARGA: 'Drop'
}

export function RoastingCurveChart({
  data,
  events = [],
  title = "Curva de Tostión",
  showRoR = true,
  showAirflow = false,
  showGas = false,
  height = 400,
  className
}: RoastingCurveChartProps) {
  // Calcular estadísticas
  const maxTemp = Math.max(...data.map(d => d.temperature))
  const minTemp = Math.min(...data.map(d => d.temperature))
  const totalTime = Math.max(...data.map(d => d.time))
  const finalTemp = data[data.length - 1]?.temperature || 0
  
  // Calcular RoR si no está incluido
  const dataWithRoR = data.map((point, index) => {
    if (index === 0) {
      return { ...point, ror: 0 }
    }
    const prevPoint = data[index - 1]
    const ror = point.ror || (point.temperature - prevPoint.temperature) / (point.time - prevPoint.time)
    return { ...point, ror }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Tiempo: ${formatTime(label)}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(1)}${entry.name === 'Temperatura' ? '°C' : 
                entry.name === 'RoR' ? '°C/min' : '%'}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(totalTime)}
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="h-4 w-4" />
              {finalTemp.toFixed(1)}°C
            </div>
          </div>
        </div>
        
        {/* Eventos de tostión */}
        {events.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {events.map((event, index) => (
              <Badge
                key={index}
                variant="outline"
                style={{ 
                  borderColor: eventColors[event.type],
                  color: eventColors[event.type]
                }}
              >
                {eventLabels[event.type]} - {formatTime(event.time)}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={dataWithRoR} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time"
              tickFormatter={(value) => formatTime(value)}
              className="text-muted-foreground"
            />
            <YAxis 
              yAxisId="temp"
              orientation="left"
              domain={[minTemp - 10, maxTemp + 10]}
              className="text-muted-foreground"
            />
            {showRoR && (
              <YAxis 
                yAxisId="ror"
                orientation="right"
                domain={[-5, 15]}
                className="text-muted-foreground"
              />
            )}
            
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Línea principal de temperatura */}
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperature"
              stroke="#dc2626"
              strokeWidth={3}
              dot={false}
              name="Temperatura"
            />
            
            {/* Línea de RoR */}
            {showRoR && (
              <Line
                yAxisId="ror"
                type="monotone"
                dataKey="ror"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="RoR"
                strokeDasharray="5 5"
              />
            )}
            
            {/* Línea de flujo de aire */}
            {showAirflow && (
              <Line
                yAxisId="ror"
                type="monotone"
                dataKey="airflow"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                name="Flujo Aire"
              />
            )}
            
            {/* Línea de gas */}
            {showGas && (
              <Line
                yAxisId="ror"
                type="monotone"
                dataKey="gas"
                stroke="#d97706"
                strokeWidth={2}
                dot={false}
                name="Gas"
              />
            )}
            
            {/* Líneas de referencia para eventos */}
            {events.map((event, index) => (
              <ReferenceLine
                key={index}
                x={event.time}
                stroke={eventColors[event.type]}
                strokeDasharray="3 3"
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Resumen de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tiempo Total</p>
            <p className="text-lg font-semibold">{formatTime(totalTime)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Temp. Final</p>
            <p className="text-lg font-semibold">{finalTemp.toFixed(1)}°C</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Temp. Máx.</p>
            <p className="text-lg font-semibold">{maxTemp.toFixed(1)}°C</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Desarrollos</p>
            <p className="text-lg font-semibold">{events.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para comparar múltiples curvas
interface CompareRoastingCurvesProps {
  curves: {
    id: string
    name: string
    data: RoastingDataPoint[]
    color: string
  }[]
  height?: number
  className?: string
}

export function CompareRoastingCurves({ curves, height = 400, className }: CompareRoastingCurvesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Comparación de Curvas de Tostión
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="time"
              tickFormatter={(value) => formatTime(value)}
              className="text-muted-foreground"
            />
            <YAxis className="text-muted-foreground" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {curves.map((curve, index) => (
              <Line
                key={curve.id}
                data={curve.data}
                type="monotone"
                dataKey="temperature"
                stroke={curve.color}
                strokeWidth={2}
                dot={false}
                name={curve.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}