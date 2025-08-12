import { PrismaClient } from '@prisma/client'

/**
 * PrismaClient singleton para evitar múltiples instancias en desarrollo
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

/**
 * Funciones de utilidad para la base de datos
 */

/**
 * Obtiene el stock disponible de café verde
 */
export async function getAvailableGreenCoffeeStock() {
  return await db.loteCafeVerde.findMany({
    where: {
      estado: 'DISPONIBLE',
      cantidadDisponible: {
        gt: 0
      }
    },
    include: {
      compra: {
        include: {
          proveedor: true
        }
      }
    },
    orderBy: {
      fechaIngreso: 'asc' // FIFO
    }
  })
}

/**
 * Obtiene el stock disponible de café pergamino
 */
export async function getAvailableParchmentCoffeeStock() {
  return await db.loteCafePergamino.findMany({
    where: {
      estado: 'DISPONIBLE',
      cantidadDisponible: {
        gt: 0
      }
    },
    include: {
      procesoTrilla: {
        include: {
          loteVerde: {
            include: {
              compra: {
                include: {
                  proveedor: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      fechaProceso: 'asc' // FIFO
    }
  })
}

/**
 * Obtiene el stock disponible de café tostado
 */
export async function getAvailableRoastedCoffeeStock() {
  return await db.loteCafeTostado.findMany({
    where: {
      estado: 'DISPONIBLE',
      cantidadDisponible: {
        gt: 0
      }
    },
    include: {
      procesoTostion: {
        include: {
          lotePergamino: {
            include: {
              procesoTrilla: {
                include: {
                  loteVerde: {
                    include: {
                      compra: {
                        include: {
                          proveedor: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      fechaTostado: 'asc' // FIFO
    }
  })
}

/**
 * Obtiene alertas de stock bajo y próximos vencimientos
 */
export async function getStockAlerts() {
  const stockMinimo = await db.configuracion.findUnique({
    where: { clave: 'STOCK_MINIMO_VERDE' }
  })
  
  const stockMinimoTostado = await db.configuracion.findUnique({
    where: { clave: 'STOCK_MINIMO_TOSTADO' }
  })

  const minGreenStock = parseFloat(stockMinimo?.valor || '500')
  const minRoastedStock = parseFloat(stockMinimoTostado?.valor || '50')
  
  // Stock bajo de café verde
  const lowGreenStock = await db.loteCafeVerde.groupBy({
    by: ['estado'],
    _sum: {
      cantidadDisponible: true
    },
    where: {
      estado: 'DISPONIBLE'
    }
  })

  // Stock bajo de café tostado
  const lowRoastedStock = await db.loteCafeTostado.groupBy({
    by: ['estado'],
    _sum: {
      cantidadDisponible: true
    },
    where: {
      estado: 'DISPONIBLE'
    }
  })

  // Productos próximos a vencer (próximos 7 días)
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  const expiringProducts = await db.loteCafeTostado.findMany({
    where: {
      fechaVencimiento: {
        lte: sevenDaysFromNow
      },
      estado: 'DISPONIBLE',
      cantidadDisponible: {
        gt: 0
      }
    },
    include: {
      procesoTostion: {
        include: {
          lotePergamino: {
            include: {
              procesoTrilla: {
                include: {
                  loteVerde: {
                    include: {
                      compra: {
                        include: {
                          proveedor: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  return {
    lowStockGreen: (lowGreenStock[0]?._sum.cantidadDisponible || 0) < minGreenStock,
    lowStockRoasted: (lowRoastedStock[0]?._sum.cantidadDisponible || 0) < minRoastedStock,
    expiringProducts,
    currentGreenStock: lowGreenStock[0]?._sum.cantidadDisponible || 0,
    currentRoastedStock: lowRoastedStock[0]?._sum.cantidadDisponible || 0,
    minGreenStock,
    minRoastedStock
  }
}

/**
 * Obtiene la trazabilidad completa de un lote
 */
export async function getFullTraceability(productCode: string) {
  // Buscar en productos terminados
  const producto = await db.productoTerminado.findUnique({
    where: { codigoProducto: productCode },
    include: {
      procesoEmpacado: {
        include: {
          loteTostado: {
            include: {
              procesoTostion: {
                include: {
                  lotePergamino: {
                    include: {
                      procesoTrilla: {
                        include: {
                          loteVerde: {
                            include: {
                              compra: {
                                include: {
                                  proveedor: true,
                                  comprador: true
                                }
                              }
                            }
                          },
                          operador: true
                        }
                      }
                    }
                  },
                  operador: true,
                  perfilTostion: true
                }
              }
            }
          },
          operador: true
        }
      }
    }
  })

  if (!producto) {
    throw new Error('Producto no encontrado')
  }

  // Construir el objeto de trazabilidad
  const compra = producto.procesoEmpacado.loteTostado.procesoTostion.lotePergamino.procesoTrilla.loteVerde.compra
  const proveedor = compra.proveedor
  const loteVerde = producto.procesoEmpacado.loteTostado.procesoTostion.lotePergamino.procesoTrilla.loteVerde
  const procesoTrilla = producto.procesoEmpacado.loteTostado.procesoTostion.lotePergamino.procesoTrilla
  const lotePergamino = producto.procesoEmpacado.loteTostado.procesoTostion.lotePergamino
  const procesoTostion = producto.procesoEmpacado.loteTostado.procesoTostion
  const loteTostado = producto.procesoEmpacado.loteTostado
  const procesoEmpacado = producto.procesoEmpacado

  return {
    producto,
    origen: {
      proveedor,
      compra,
      loteVerde
    },
    trilla: {
      proceso: procesoTrilla,
      lotePergamino
    },
    tostion: {
      proceso: procesoTostion,
      loteTostado,
      perfil: procesoTostion.perfilTostion
    },
    empacado: {
      proceso: procesoEmpacado
    }
  }
}

/**
 * Actualiza la cantidad disponible de un lote
 */
export async function updateLotQuantity(
  lotType: 'verde' | 'pergamino' | 'tostado' | 'terminado',
  lotId: string,
  quantityChange: number,
  userId: string,
  reason: string
) {
  const tables = {
    verde: db.loteCafeVerde,
    pergamino: db.loteCafePergamino,
    tostado: db.loteCafeTostado,
    terminado: db.productoTerminado
  }

  const table = tables[lotType]
  
  // Obtener cantidad actual
  const currentLot = await table.findUnique({
    where: { id: lotId }
  }) as any

  if (!currentLot) {
    throw new Error('Lote no encontrado')
  }

  const currentQuantity = lotType === 'terminado' 
    ? currentLot.cantidadDisponible 
    : currentLot.cantidadDisponible
    
  const newQuantity = currentQuantity + quantityChange

  if (newQuantity < 0) {
    throw new Error('No hay suficiente cantidad disponible')
  }

  // Actualizar cantidad
  const updatedLot = await table.update({
    where: { id: lotId },
    data: {
      [lotType === 'terminado' ? 'cantidadDisponible' : 'cantidadDisponible']: newQuantity
    }
  })

  // Registrar movimiento
  const tipoInventario = {
    verde: 'CAFE_VERDE',
    pergamino: 'CAFE_PERGAMINO', 
    tostado: 'CAFE_TOSTADO',
    terminado: 'PRODUCTO_TERMINADO'
  }[lotType] as any

  const tipoMovimiento = quantityChange > 0 ? 'ENTRADA' : 'SALIDA'

  await db.movimientoInventario.create({
    data: {
      usuarioId: userId,
      tipoMovimiento,
      tipoInventario,
      [`${lotType === 'verde' ? 'loteVerde' : 
          lotType === 'pergamino' ? 'lotePergamino' :
          lotType === 'tostado' ? 'loteTostado' :
          'productoTerminado'}Id`]: lotId,
      cantidadAnterior: currentQuantity,
      cantidadMovimiento: Math.abs(quantityChange),
      cantidadNueva: newQuantity,
      motivo: reason
    }
  })

  return updatedLot
}