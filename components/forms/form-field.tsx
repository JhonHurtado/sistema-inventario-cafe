"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  name: string
  label: string
  placeholder?: string
  type?: string
  className?: string
  required?: boolean
  description?: string
  children?: React.ReactNode
}

export function FormField({
  name,
  label,
  placeholder,
  type = "text",
  className,
  required = false,
  description,
  children,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {children || (
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={cn(
            error && "border-red-500 focus-visible:ring-red-500"
          )}
        />
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

// Componente específico para campos de peso
export function WeightField({ name, label, ...props }: Omit<FormFieldProps, 'type'>) {
  return (
    <FormField
      name={name}
      label={label}
      type="number"
      placeholder="0.0"
      {...props}
    >
      <div className="relative">
        <Input
          id={name}
          type="number"
          step="0.1"
          min="0"
          placeholder="0.0"
          {...useFormContext().register(name, { valueAsNumber: true })}
          className={cn(
            "pr-8",
            useFormContext().formState.errors[name] && "border-red-500"
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-sm text-muted-foreground">kg</span>
        </div>
      </div>
    </FormField>
  )
}

// Componente específico para campos de temperatura
export function TemperatureField({ name, label, ...props }: Omit<FormFieldProps, 'type'>) {
  return (
    <FormField
      name={name}
      label={label}
      type="number"
      placeholder="0"
      {...props}
    >
      <div className="relative">
        <Input
          id={name}
          type="number"
          min="0"
          max="300"
          placeholder="0"
          {...useFormContext().register(name, { valueAsNumber: true })}
          className={cn(
            "pr-8",
            useFormContext().formState.errors[name] && "border-red-500"
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-sm text-muted-foreground">°C</span>
        </div>
      </div>
    </FormField>
  )
}

// Componente específico para campos de porcentaje
export function PercentageField({ name, label, ...props }: Omit<FormFieldProps, 'type'>) {
  return (
    <FormField
      name={name}
      label={label}
      type="number"
      placeholder="0"
      {...props}
    >
      <div className="relative">
        <Input
          id={name}
          type="number"
          step="0.1"
          min="0"
          max="100"
          placeholder="0"
          {...useFormContext().register(name, { valueAsNumber: true })}
          className={cn(
            "pr-8",
            useFormContext().formState.errors[name] && "border-red-500"
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>
    </FormField>
  )
}

// Componente específico para campos de precio
export function PriceField({ name, label, ...props }: Omit<FormFieldProps, 'type'>) {
  return (
    <FormField
      name={name}
      label={label}
      type="number"
      placeholder="0"
      {...props}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-sm text-muted-foreground">$</span>
        </div>
        <Input
          id={name}
          type="number"
          min="0"
          placeholder="0"
          {...useFormContext().register(name, { valueAsNumber: true })}
          className={cn(
            "pl-8",
            useFormContext().formState.errors[name] && "border-red-500"
          )}
        />
      </div>
    </FormField>
  )
}