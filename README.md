# Sistema de Gestión de Inventario de Café ☕

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)

Sistema completo de gestión de inventario de café desde la compra hasta el empacado final, con trazabilidad completa y control detallado del proceso de tostión.

## 🚀 Características Principales

### 📊 Módulos del Sistema
- **🛒 Gestión de Compras**: Control de proveedores y adquisición de café verde
- **🌾 Trilla y Rendimiento**: Procesamiento y cálculo automático de rendimientos
- **🔥 Control de Tostión**: Registro detallado con curvas de tostión en tiempo real
- **📦 Empacado y Etiquetado**: Gestión de productos finales y generación de etiquetas
- **📈 Inventario Integral**: Control de stock en todas las etapas del proceso
- **🔍 Trazabilidad Completa**: Seguimiento desde origen hasta producto final

### 🛠️ Tecnologías

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Base de Datos**: Prisma ORM + SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: NextAuth.js v5
- **Formularios**: React Hook Form + Zod validation
- **Gráficos**: Recharts (curvas de tostión)
- **Estado**: Zustand
- **Testing**: Jest + React Testing Library

## 📁 Estructura del Proyecto

```
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard principal
│   ├── compras/                 # Módulo de compras
│   ├── trilla/                  # Módulo de trilla
│   ├── tostion/                 # Módulo de tostión
│   ├── empacado/                # Módulo de empacado
│   ├── inventario/              # Módulo de inventario
│   ├── trazabilidad/            # Módulo de trazabilidad
│   └── api/                     # API Routes
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes shadcn/ui
│   ├── forms/                   # Componentes de formularios
│   ├── charts/                  # Componentes de gráficos
│   └── tables/                  # Componentes de tablas
├── lib/                         # Utilidades y configuraciones
│   ├── db.ts                    # Configuración de base de datos
│   ├── auth.ts                  # Configuración de autenticación
│   ├── validations/             # Esquemas de validación Zod
│   └── utils.ts                 # Funciones utilitarias
├── prisma/                      # Esquema de base de datos
│   ├── schema.prisma            # Definición del modelo de datos
│   └── seed.ts                  # Datos de ejemplo
└── public/                      # Archivos estáticos
```

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18+ 
- npm, yarn o pnpm
- Base de datos SQLite (desarrollo) o PostgreSQL (producción)

### 1. Clonar el repositorio
```bash
git clone https://github.com/JhonHurtado/sistema-inventario-cafe.git
cd sistema-inventario-cafe
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus configuraciones:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configurar base de datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# Poblar con datos de ejemplo
npx prisma db seed
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📊 Funcionalidades Detalladas

### 🔥 Módulo de Tostión (Principal)
- **Perfiles de Tostión**: Biblioteca de perfiles personalizables
- **Registro en Tiempo Real**: Temperatura, RoR, eventos de crack
- **Curvas de Tostión**: Gráficos interactivos con Recharts
- **Control de Calidad**: Evaluación post-tostión
- **Análisis Comparativo**: Comparación entre perfiles

### 📈 Sistema de Trazabilidad
- **Códigos QR**: Generación automática para cada lote
- **Timeline Visual**: Seguimiento completo del proceso
- **Historial Detallado**: Registro de cada etapa y responsable
- **Búsqueda Avanzada**: Filtros por múltiples criterios
- **Reportes**: Trazabilidad completa para auditorías

### 🛒 Gestión de Compras
- **Gestión de Proveedores**: Base de datos completa
- **Órdenes de Compra**: Workflow completo de adquisiciones
- **Control de Calidad**: Evaluación inicial del café verde
- **Documentación**: Gestión de facturas y certificados

### 📦 Control de Inventario
- **Multi-etapa**: Stock en verde, pergamino, tostado y empacado
- **Alertas Automáticas**: Stock mínimo y fechas de vencimiento
- **Rotación FIFO**: Gestión automática de antigüedad
- **Movimientos**: Registro detallado de entradas y salidas

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer deploy
vercel --prod
```

### Docker
```bash
# Construir imagen
docker build -t sistema-inventario-cafe .

# Ejecutar contenedor
docker run -p 3000:3000 sistema-inventario-cafe
```

## 📚 Documentación Adicional

- [Guía de Usuario](./docs/user-guide.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Soporte

Si tienes alguna pregunta o necesitas ayuda:

- Abrir un [issue](https://github.com/JhonHurtado/sistema-inventario-cafe/issues)
- Contactar: [tu-email@ejemplo.com]

---

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella!
