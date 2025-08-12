import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // =============================================================================
  // USUARIOS Y AUTENTICACIÓN
  // =============================================================================
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cafeinventario.com' },
    update: {},
    create: {
      email: 'admin@cafeinventario.com',
      name: 'Administrador Sistema',
      role: 'ADMIN',
      isActive: true,
    },
  })

  const managerUser = await prisma.user.upsert({
    where: { email: 'gerente@cafeinventario.com' },
    update: {},
    create: {
      email: 'gerente@cafeinventario.com',
      name: 'Gerente de Producción',
      role: 'MANAGER',
      isActive: true,
    },
  })

  const operatorUser = await prisma.user.upsert({
    where: { email: 'operador@cafeinventario.com' },
    update: {},
    create: {
      email: 'operador@cafeinventario.com',
      name: 'Operador de Tostión',
      role: 'OPERATOR',
      isActive: true,
    },
  })

  console.log('✅ Usuarios creados')

  // =============================================================================
  // PROVEEDORES
  // =============================================================================

  const proveedores = await prisma.proveedor.createMany({
    data: [
      {
        nombre: 'Cooperativa Cafetera del Huila',
        contacto: 'María González',
        telefono: '+57 318 123 4567',
        email: 'maria@coophuila.com',
        direccion: 'Carrera 5 #12-34, Pitalito, Huila',
        tipoProveedor: 'Cooperativa',
        certificaciones: JSON.stringify(['Orgánico', 'Fair Trade', 'Rainforest Alliance']),
        calificacion: 9.2,
      },
      {
        nombre: 'Finca El Paraíso',
        contacto: 'Carlos Rodríguez',
        telefono: '+57 312 987 6543',
        email: 'carlos@fincaparaiso.com',
        direccion: 'Vereda El Paraíso, Acevedo, Huila',
        tipoProveedor: 'Finca',
        certificaciones: JSON.stringify(['Orgánico', 'Specialty Coffee']),
        calificacion: 8.8,
      },
      {
        nombre: 'Comercializadora Café Premium',
        contacto: 'Ana Martínez',
        telefono: '+57 315 456 7890',
        email: 'ana@cafepremium.com',
        direccion: 'Zona Industrial, Armenia, Quindío',
        tipoProveedor: 'Comercializador',
        certificaciones: JSON.stringify(['UTZ Certified']),
        calificacion: 7.5,
      },
    ],
  })

  console.log('✅ Proveedores creados')

  // =============================================================================
  // PERFILES DE TOSTIÓN
  // =============================================================================

  const perfilesBasicos = await prisma.perfilTostion.createMany({
    data: [
      {
        nombre: 'Tostión Clara Americana',
        descripcion: 'Perfil para cafés de origen con notas frutales y florales',
        temperaturaInicial: 160,
        temperaturaObjetivo: 196,
        tiempoEstimado: 12,
        flujoAireInicial: 75,
        nivelTostion: 'LIGHT',
        firstCrackInicioEsperado: 8,
        firstCrackFinalEsperado: 10,
        esFavorito: true,
        vecesUtilizado: 15,
      },
      {
        nombre: 'Tostión Media Balanceada',
        descripcion: 'Perfil versátil para espresso y métodos de filtrado',
        temperaturaInicial: 165,
        temperaturaObjetivo: 210,
        tiempoEstimado: 14,
        flujoAireInicial: 70,
        nivelTostion: 'MEDIUM',
        firstCrackInicioEsperado: 9,
        firstCrackFinalEsperado: 11,
        secondCrackInicioEsperado: 13,
        esFavorito: true,
        vecesUtilizado: 28,
      },
      {
        nombre: 'Tostión Oscura Italiana',
        descripcion: 'Perfil para espresso tradicional con cuerpo y amargor balanceado',
        temperaturaInicial: 170,
        temperaturaObjetivo: 225,
        tiempoEstimado: 16,
        flujoAireInicial: 65,
        nivelTostion: 'DARK',
        firstCrackInicioEsperado: 8,
        firstCrackFinalEsperado: 10,
        secondCrackInicioEsperado: 12,
        secondCrackFinalEsperado: 14,
        vecesUtilizado: 8,
      },
    ],
  })

  console.log('✅ Perfiles de tostión creados')

  // =============================================================================
  // CONFIGURACIONES DEL SISTEMA
  // =============================================================================

  const configuraciones = await prisma.configuracion.createMany({
    data: [
      {
        clave: 'EMPRESA_NOMBRE',
        valor: 'CoffeeTrack Pro',
        descripcion: 'Nombre de la empresa para reportes y etiquetas',
        tipo: 'STRING',
        categoria: 'EMPRESA',
      },
      {
        clave: 'EMPRESA_DIRECCION',
        valor: 'Carrera 10 #15-25, Bogotá, Colombia',
        descripcion: 'Dirección de la empresa',
        tipo: 'STRING',
        categoria: 'EMPRESA',
      },
      {
        clave: 'STOCK_MINIMO_VERDE',
        valor: '500',
        descripcion: 'Stock mínimo en kg para café verde',
        tipo: 'NUMBER',
        categoria: 'INVENTARIO',
      },
      {
        clave: 'STOCK_MINIMO_TOSTADO',
        valor: '50',
        descripcion: 'Stock mínimo en kg para café tostado',
        tipo: 'NUMBER',
        categoria: 'INVENTARIO',
      },
      {
        clave: 'DIAS_VENCIMIENTO_TOSTADO',
        valor: '30',
        descripcion: 'Días de vencimiento para café tostado',
        tipo: 'NUMBER',
        categoria: 'PRODUCCION',
      },
      {
        clave: 'MERMA_ESPERADA_TOSTION',
        valor: '18',
        descripcion: 'Porcentaje de merma esperada en tostión',
        tipo: 'NUMBER',
        categoria: 'PRODUCCION',
      },
      {
        clave: 'ALERTAS_EMAIL_ACTIVAS',
        valor: 'true',
        descripcion: 'Activar notificaciones por email',
        tipo: 'BOOLEAN',
        categoria: 'NOTIFICACIONES',
      },
    ],
  })

  console.log('✅ Configuraciones del sistema creadas')

  // =============================================================================
  // DATOS DE EJEMPLO PARA DEMONSTRACIÓN
  // =============================================================================

  // Obtener proveedores para las compras
  const proveedoresList = await prisma.proveedor.findMany()
  
  // Crear algunas compras de ejemplo
  const fechaHoy = new Date()
  const fechaAyer = new Date(fechaHoy)
  fechaAyer.setDate(fechaAyer.getDate() - 1)
  
  const compra1 = await prisma.compra.create({
    data: {
      numeroFactura: 'FAC-2024-001',
      proveedorId: proveedoresList[0].id,
      compradorId: managerUser.id,
      fechaCompra: fechaAyer,
      fechaVencimiento: new Date(fechaAyer.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 año
      tipoCafe: 'Arábica',
      variedad: 'Caturra',
      origen: 'Huila, Colombia',
      procesosBeneficio: 'Lavado',
      cantidadKg: 500,
      precioKg: 12500,
      precioTotal: 6250000,
      numeroSacos: 10,
      humedad: 12.5,
      calidad: 9,
      esOrganico: true,
      esFairTrade: true,
      certificaciones: JSON.stringify(['Orgánico', 'Fair Trade']),
      observaciones: 'Excelente calidad, sin defectos visibles',
      codigoLote: 'HU-CATUR-001-2024',
      estado: 'RECIBIDA',
    },
  })

  const compra2 = await prisma.compra.create({
    data: {
      numeroFactura: 'FAC-2024-002',
      proveedorId: proveedoresList[1].id,
      compradorId: managerUser.id,
      fechaCompra: fechaHoy,
      fechaVencimiento: new Date(fechaHoy.getTime() + 365 * 24 * 60 * 60 * 1000),
      tipoCafe: 'Arábica',
      variedad: 'Castillo',
      origen: 'Acevedo, Huila',
      procesosBeneficio: 'Honey',
      cantidadKg: 300,
      precioKg: 15000,
      precioTotal: 4500000,
      numeroSacos: 6,
      humedad: 11.8,
      calidad: 8,
      esOrganico: true,
      certificaciones: JSON.stringify(['Orgánico', 'Specialty Coffee']),
      observaciones: 'Café especial con notas dulces',
      codigoLote: 'HU-CAST-002-2024',
      estado: 'RECIBIDA',
    },
  })

  console.log('✅ Compras de ejemplo creadas')

  // Crear lotes de café verde correspondientes
  const loteVerde1 = await prisma.loteCafeVerde.create({
    data: {
      compraId: compra1.id,
      codigoLote: compra1.codigoLote,
      cantidadKg: compra1.cantidadKg,
      cantidadDisponible: compra1.cantidadKg,
      ubicacionAlmacen: 'A-01',
      tipoCafe: compra1.tipoCafe,
      variedad: compra1.variedad,
      origen: compra1.origen,
      humedad: compra1.humedad,
      calidad: compra1.calidad,
      fechaIngreso: compra1.fechaCompra,
      fechaVencimiento: compra1.fechaVencimiento,
      estado: 'DISPONIBLE',
    },
  })

  const loteVerde2 = await prisma.loteCafeVerde.create({
    data: {
      compraId: compra2.id,
      codigoLote: compra2.codigoLote,
      cantidadKg: compra2.cantidadKg,
      cantidadDisponible: compra2.cantidadKg,
      ubicacionAlmacen: 'A-02',
      tipoCafe: compra2.tipoCafe,
      variedad: compra2.variedad,
      origen: compra2.origen,
      humedad: compra2.humedad,
      calidad: compra2.calidad,
      fechaIngreso: compra2.fechaCompra,
      fechaVencimiento: compra2.fechaVencimiento,
      estado: 'DISPONIBLE',
    },
  })

  console.log('✅ Lotes de café verde creados')

  // Crear un proceso de trilla de ejemplo
  const procesoTrilla1 = await prisma.procesoTrilla.create({
    data: {
      loteVerdeId: loteVerde1.id,
      operadorId: operatorUser.id,
      fechaProceso: new Date(),
      cantidadInicialKg: 100,
      cantidadPergaminoKg: 82,
      cantidadPrimeraKg: 78,
      cantidadSegundaKg: 4,
      cantidadMermaKg: 18,
      rendimientoPergamino: 82,
      rendimientoPrimera: 78,
      rendimientoSegunda: 4,
      porcentajeMerma: 18,
      humedadDespues: 11.5,
      observaciones: 'Proceso normal, buen rendimiento',
      codigoLotePergamino: 'PERG-HU-CATUR-001-2024',
      estado: 'COMPLETADO',
    },
  })

  // Crear lote de pergamino resultante
  const lotePergamino1 = await prisma.loteCafePergamino.create({
    data: {
      procesoTrillaId: procesoTrilla1.id,
      codigoLote: procesoTrilla1.codigoLotePergamino,
      clasificacion: 'PRIMERA',
      cantidadKg: procesoTrilla1.cantidadPrimeraKg,
      cantidadDisponible: procesoTrilla1.cantidadPrimeraKg,
      ubicacionAlmacen: 'B-01',
      origenTrilla: loteVerde1.codigoLote,
      tipoCafe: loteVerde1.tipoCafe,
      variedad: loteVerde1.variedad,
      origen: loteVerde1.origen,
      humedad: procesoTrilla1.humedadDespues,
      calidad: loteVerde1.calidad,
      fechaProceso: procesoTrilla1.fechaProceso,
      fechaVencimiento: new Date(procesoTrilla1.fechaProceso.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 meses
      estado: 'DISPONIBLE',
    },
  })

  console.log('✅ Proceso de trilla y lote pergamino creados')

  // Crear proceso de tostión de ejemplo con datos detallados
  const perfilesCreados = await prisma.perfilTostion.findMany()
  
  const procesoTostion1 = await prisma.procesoTostion.create({
    data: {
      lotePergaminoId: lotePergamino1.id,
      operadorId: operatorUser.id,
      perfilToscionId: perfilesCreados[1].id, // Tostión media balanceada
      fechaProceso: new Date(),
      cantidadInicialKg: 20,
      temperaturaInicial: 165,
      temperaturaObjetivo: 210,
      tiempoEstimado: 14,
      flujoAireInicial: 70,
      nivelToscionObjetivo: 'MEDIUM',
      tiempoTotalMinutos: 14,
      temperaturaFinal: 208,
      nivelToscionAlcanzado: 'MEDIUM',
      pesoFinalKg: 16.4,
      porcentajeMerma: 18,
      colorTostion: 'Agtron 58',
      aromaPuntuacion: 8,
      cuerpoBalanceado: true,
      acidezNivel: 7,
      observacionesCalidad: 'Excelente desarrollo, notas a chocolate y caramelo',
      codigoLoteTostado: 'TOST-HU-CATUR-001-2024',
      estado: 'COMPLETADO',
    },
  })

  // Crear datos de la curva de tostión
  const datosTostion = []
  const eventosTostion = []

  // Simular datos de temperatura cada minuto
  const temperaturas = [165, 172, 180, 188, 195, 201, 206, 209, 210, 210, 209, 208, 207, 208]
  for (let i = 0; i < temperaturas.length; i++) {
    datosTostion.push({
      procesoToscionId: procesoTostion1.id,
      minuto: i,
      temperatura: temperaturas[i],
      ror: i > 0 ? temperaturas[i] - temperaturas[i-1] : 0,
      flujoAire: 70 - (i * 2), // Reducir aire gradualmente
      nivelGas: 80 - (i * 3), // Reducir gas gradualmente
    })
  }

  await prisma.datoTostion.createMany({ data: datosTostion })

  // Crear eventos de crack
  await prisma.eventoTostion.createMany({
    data: [
      {
        procesoToscionId: procesoTostion1.id,
        tipoEvento: 'FIRST_CRACK_INICIO',
        minuto: 8,
        segundo: 45,
        temperatura: 195,
        observaciones: 'Inicio uniforme del primer crack',
      },
      {
        procesoToscionId: procesoTostion1.id,
        tipoEvento: 'FIRST_CRACK_FINAL',
        minuto: 10,
        segundo: 20,
        temperatura: 201,
        observaciones: 'Final del primer crack, desarrollo controlado',
      },
      {
        procesoToscionId: procesoTostion1.id,
        tipoEvento: 'DESCARGA',
        minuto: 14,
        segundo: 0,
        temperatura: 208,
        observaciones: 'Descarga a temperatura objetivo',
      },
    ],
  })

  console.log('✅ Proceso de tostión con datos detallados creado')

  // Crear lote tostado resultante
  const loteTostado1 = await prisma.loteCafeTostado.create({
    data: {
      procesoToscionId: procesoTostion1.id,
      codigoLote: procesoTostion1.codigoLoteTostado,
      cantidadKg: procesoTostion1.pesoFinalKg || 16.4,
      cantidadDisponible: procesoTostion1.pesoFinalKg || 16.4,
      ubicacionAlmacen: 'C-01',
      nivelTostion: procesoTostion1.nivelToscionAlcanzado || 'MEDIUM',
      fechaTostado: procesoTostion1.fechaProceso,
      fechaVencimiento: new Date(procesoTostion1.fechaProceso.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 días
      perfilSabor: JSON.stringify({
        notas: ['Chocolate', 'Caramelo', 'Nuez'],
        acidez: 7,
        cuerpo: 8,
        dulzor: 8,
        balance: 9,
      }),
      origenCompleto: `${loteVerde1.origen} → ${procesoTrilla1.codigoLotePergamino} → ${procesoTostion1.codigoLoteTostado}`,
      tipoCafe: loteVerde1.tipoCafe,
      variedad: loteVerde1.variedad,
      origen: loteVerde1.origen,
      estado: 'DISPONIBLE',
    },
  })

  console.log('✅ Lote de café tostado creado')

  // Registrar movimientos de inventario
  await prisma.movimientoInventario.createMany({
    data: [
      {
        usuarioId: managerUser.id,
        tipoMovimiento: 'ENTRADA',
        tipoInventario: 'CAFE_VERDE',
        compraId: compra1.id,
        loteVerdeId: loteVerde1.id,
        cantidadAnterior: 0,
        cantidadMovimiento: 500,
        cantidadNueva: 500,
        motivo: 'Compra inicial de café verde',
        fechaMovimiento: compra1.fechaCompra,
      },
      {
        usuarioId: operatorUser.id,
        tipoMovimiento: 'PROCESO',
        tipoInventario: 'CAFE_VERDE',
        loteVerdeId: loteVerde1.id,
        procesoTrillaId: procesoTrilla1.id,
        cantidadAnterior: 500,
        cantidadMovimiento: -100,
        cantidadNueva: 400,
        motivo: 'Proceso de trilla',
        observaciones: 'Procesamiento para obtener pergamino',
      },
      {
        usuarioId: operatorUser.id,
        tipoMovimiento: 'ENTRADA',
        tipoInventario: 'CAFE_PERGAMINO',
        lotePergaminoId: lotePergamino1.id,
        procesoTrillaId: procesoTrilla1.id,
        cantidadAnterior: 0,
        cantidadMovimiento: 78,
        cantidadNueva: 78,
        motivo: 'Resultado del proceso de trilla',
      },
      {
        usuarioId: operatorUser.id,
        tipoMovimiento: 'PROCESO',
        tipoInventario: 'CAFE_PERGAMINO',
        lotePergaminoId: lotePergamino1.id,
        procesoToscionId: procesoTostion1.id,
        cantidadAnterior: 78,
        cantidadMovimiento: -20,
        cantidadNueva: 58,
        motivo: 'Proceso de tostión',
      },
      {
        usuarioId: operatorUser.id,
        tipoMovimiento: 'ENTRADA',
        tipoInventario: 'CAFE_TOSTADO',
        loteTostadoId: loteTostado1.id,
        procesoToscionId: procesoTostion1.id,
        cantidadAnterior: 0,
        cantidadMovimiento: 16.4,
        cantidadNueva: 16.4,
        motivo: 'Resultado del proceso de tostión',
      },
    ],
  })

  console.log('✅ Movimientos de inventario registrados')

  console.log('🎉 Seed completado exitosamente!')
  console.log('')
  console.log('📊 Resumen de datos creados:')
  console.log('- 3 usuarios (admin, gerente, operador)')
  console.log('- 3 proveedores')
  console.log('- 3 perfiles de tostión')
  console.log('- 7 configuraciones del sistema')
  console.log('- 2 compras de café verde')
  console.log('- 2 lotes de café verde')
  console.log('- 1 proceso de trilla con lote pergamino')
  console.log('- 1 proceso de tostión completo con curva')
  console.log('- 1 lote de café tostado')
  console.log('- 5 movimientos de inventario')
  console.log('')
  console.log('🔑 Credenciales de acceso:')
  console.log('Admin: admin@cafeinventario.com')
  console.log('Gerente: gerente@cafeinventario.com')
  console.log('Operador: operador@cafeinventario.com')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en el seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
