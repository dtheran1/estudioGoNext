# Resumen del Proyecto - estudioNextGo

## Descripción General
Aplicación full-stack de gestión de tareas (TODO List) desarrollada con **Go** en el backend y **Next.js** en el frontend, implementando una arquitectura cliente-servidor moderna.

---

## Arquitectura del Sistema

### Arquitectura de 2 Capas (Client-Server)

```
┌─────────────────────────────────┐
│   Frontend (Next.js 16)         │
│   - React 19                    │
│   - TypeScript                  │
│   - TailwindCSS 4               │
└───────────────┬─────────────────┘
                │
                │ HTTP REST API
                │ JSON
                │
┌───────────────▼─────────────────┐
│   Backend (Go + Gin)            │
│   - RESTful API                 │
│   - CORS Middleware             │
└───────────────┬─────────────────┘
                │
┌───────────────▼─────────────────┐
│   In-Memory Storage             │
│   (Array de Todos)              │
└─────────────────────────────────┘
```

---

## Stack Tecnológico

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Go** | 1.26.1 | Lenguaje de programación |
| **Gin Framework** | 1.12.0 | Framework web HTTP de alto rendimiento |
| **gin-contrib/cors** | 1.7.7 | Middleware para manejo de CORS |
| **MongoDB Driver** | 2.5.0 | Driver de BD (preparado para integración futura) |

**Características:**
- RESTful API con 4 endpoints CRUD
- Validación de datos con go-playground/validator
- JSON serialization ultra-rápida (Sonic)
- Soporte HTTP/2 y potencial HTTP/3 (QUIC)

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 16.2.4 | Framework React con SSR/SSG |
| **React** | 19.2.4 | Biblioteca UI |
| **TypeScript** | 5.x | Tipado estático |
| **TailwindCSS** | 4.x | Framework CSS utility-first |
| **ESLint** | 9.x | Linting y calidad de código |

**Características:**
- App Router (Next.js 13+)
- Server Components por defecto
- Turbopack como bundler de desarrollo
- TypeScript strict mode
- Optimización automática de fuentes

---

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/todos` | Obtiene todas las tareas |
| **POST** | `/todos` | Crea una nueva tarea |
| **PATCH** | `/todos/:id` | Marca una tarea como completada |
| **DELETE** | `/todos/:id` | Elimina una tarea por ID |

**Modelo de Datos:**
```go
type Todo struct {
    ID        int    `json:"id"`
    Title     string `json:"title"`
    Completed bool   `json:"completed"`
}
```

---

## Patrones de Diseño Implementados

### Patrones Backend (Go)

1. **RESTful API Pattern**
   - Uso de verbos HTTP semánticos (GET, POST, PATCH, DELETE)
   - Recursos orientados a entidades
   - Códigos de estado HTTP apropiados (200, 201, 400, 404)

2. **Handler Pattern**
   - Funciones handler separadas por operación CRUD
   - `getTodos()`, `createTodo()`, `deleteTodo()`, `completeTodo()`
   - Cada handler recibe contexto de Gin (`*gin.Context`)

3. **Middleware Chain**
   - CORS middleware para seguridad
   - Logger y Recovery middleware (Gin.Default())

4. **In-Memory Repository**
   - Almacenamiento temporal en array
   - Variables globales: `todos []Todo` y `nextID int`

### Patrones Frontend (React/Next.js)

1. **Component-Based Architecture**
   - Separación clara entre Layout y Page
   - Composición de componentes

2. **React Hooks Pattern**
   - `useState` para manejo de estado local (todos, title, loading, error)
   - `useEffect` para carga inicial de datos

3. **Controlled Components**
   - Input controlado con value/onChange
   - Formulario con onSubmit handler

4. **Client-Side Rendering (CSR)**
   - Uso de `"use client"` directiva
   - Interactividad completa del lado del cliente

5. **Utility-First CSS**
   - TailwindCSS para estilos inline
   - Diseño responsive

6. **Environment-based Configuration**
   - Variables de entorno para API URL
   - `NEXT_PUBLIC_API_URL=http://localhost:8080`

---

## Estructura del Proyecto

```
estudioNextGo/
├── backend/
│   ├── go.mod              # Dependencias Go
│   ├── go.sum              # Checksums de dependencias
│   └── main.go             # Aplicación completa (handlers + routes)
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx      # Layout raíz con metadata y fonts
│   │   ├── page.tsx        # Página principal (TODO List)
│   │   ├── globals.css     # Estilos globales + Tailwind
│   │   └── favicon.ico
│   │
│   ├── public/             # Assets estáticos (SVGs)
│   ├── .env.local          # Variables de entorno
│   ├── package.json        # Dependencias npm
│   ├── tsconfig.json       # Configuración TypeScript
│   ├── next.config.ts      # Configuración Next.js
│   ├── eslint.config.mjs   # Configuración ESLint
│   └── postcss.config.mjs  # Configuración PostCSS
│
└── readme.md
```

---

## Configuración y Seguridad

### CORS (Cross-Origin Resource Sharing)

**Configuración en Backend:**
```go
config := cors.DefaultConfig()
config.AllowOrigins = []string{"http://localhost:3000"}
config.AllowMethods = []string{"GET", "POST", "PATCH", "DELETE"}
config.AllowHeaders = []string{"Content-Type"}
```

Permite comunicación segura entre frontend (puerto 3000) y backend (puerto 8080).

### TypeScript Strict Mode

- Tipado estricto habilitado
- Validación de tipos en tiempo de compilación
- IntelliSense mejorado

---

## Flujo de Datos

```
Usuario → Frontend (React State) → Fetch API → Backend (Gin) → In-Memory Store
   ↑                                                                      │
   └──────────────────── HTTP Response (JSON) ────────────────────────────┘
```

**Operaciones:**
1. **Carga inicial:** `useEffect` ejecuta GET `/todos` al montar componente
2. **Crear tarea:** POST `/todos` con título, actualiza estado local
3. **Completar tarea:** PATCH `/todos/:id`, actualiza estado local
4. **Eliminar tarea:** DELETE `/todos/:id`, actualiza estado local

---

## Características Técnicas Destacadas

### Backend (Go)

- **Alto rendimiento:** Gin es uno de los frameworks más rápidos de Go
- **Concurrencia:** Go maneja múltiples peticiones simultáneas eficientemente
- **Tipado fuerte:** Compilación estática previene errores en runtime
- **JSON ultra-rápido:** Bytedance Sonic para serialización optimizada

### Frontend (Next.js)

- **App Router:** Arquitectura moderna de Next.js 13+
- **Turbopack:** Bundler de próxima generación (más rápido que Webpack)
- **Font Optimization:** Google Fonts optimizadas automáticamente
- **TypeScript:** Desarrollo type-safe con autocompletado
- **Tailwind v4:** Nueva sintaxis CSS simplificada

---

## Principios de Desarrollo

### Backend

- **RESTful Design:** API semántica y predecible
- **Separation of Concerns:** Handlers independientes por operación
- **Error Handling:** Validación de entrada y respuestas HTTP apropiadas
- **CORS Security:** Restricción de orígenes permitidos

### Frontend

- **Single Responsibility:** Componentes con propósito único
- **Declarative UI:** React maneja el DOM automáticamente
- **Controlled State:** Única fuente de verdad para datos
- **Loading States:** Feedback visual durante operaciones asíncronas

---

## Aspectos a Mejorar (Roadmap)

### Backend

- [ ] Separación en capas (handlers/services/repositories)
- [ ] Integración con base de datos real (PostgreSQL/MongoDB)
- [ ] Logging estructurado (zerolog/zap)
- [ ] Tests unitarios e integración
- [ ] Documentación API (Swagger/OpenAPI)
- [ ] Health check endpoint
- [ ] Autenticación y autorización
- [ ] Graceful shutdown

### Frontend

- [ ] Componentes reutilizables extraídos
- [ ] Biblioteca de data fetching (SWR/TanStack Query)
- [ ] Validación de formularios (React Hook Form + Zod)
- [ ] Error boundaries
- [ ] Tests (Jest + Testing Library)
- [ ] Loading states por acción
- [ ] Sistema de notificaciones (toast)
- [ ] PWA capabilities

### DevOps

- [ ] Dockerización (Docker Compose)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring y observability
- [ ] Deployment automatizado

---

## Cómo Ejecutar el Proyecto

### Backend (Puerto 8080)
```bash
cd backend
go run main.go
```

### Frontend (Puerto 3000)
```bash
cd frontend
npm install
npm run dev
```

**Acceso:** http://localhost:3000

---

## Conclusiones para la Entrevista

### Puntos Fuertes a Destacar

1. **Stack Moderno:** Uso de las últimas versiones de Go, Next.js y React
2. **Arquitectura Clara:** Separación frontend/backend bien definida
3. **RESTful API:** Implementación correcta de principios REST
4. **TypeScript:** Desarrollo type-safe en frontend
5. **Performance:** Tecnologías optimizadas para velocidad (Gin, Turbopack, Sonic)
6. **CORS Configurado:** Seguridad básica implementada
7. **Responsive Design:** TailwindCSS para adaptabilidad

### Contexto del Proyecto

- **Nivel:** Proyecto educativo/MVP
- **Propósito:** Aprendizaje de desarrollo full-stack moderno
- **Escalabilidad:** Preparado para evolucionar (MongoDB driver instalado)
- **Simplicidad:** Código limpio y fácil de entender

### Decisiones Arquitectónicas

1. **Go + Gin:** Elegido por performance y simplicidad
2. **Next.js 16:** Framework React más popular con excelente DX
3. **In-Memory Storage:** Simplifica desarrollo inicial, fácil migrar a BD
4. **Monorepo:** Backend y frontend en mismo repositorio para facilidad de desarrollo
5. **REST sobre GraphQL:** Más simple para operaciones CRUD básicas

---

## Tecnologías Clave - Resumen Visual

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (Next.js)                 │
│  React 19 • TypeScript • TailwindCSS 4          │
│  App Router • Turbopack • ESLint               │
└─────────────────┬───────────────────────────────┘
                  │
                  │ HTTP/REST + JSON
                  │
┌─────────────────▼───────────────────────────────┐
│               BACKEND (Go)                      │
│  Gin 1.12 • CORS • Validator                   │
│  Sonic JSON • MongoDB Driver (ready)           │
└─────────────────────────────────────────────────┘
```

---

**Autor:** [Tu Nombre]  
**Fecha:** Mayo 2026  
**Repositorio:** estudioNextGo
