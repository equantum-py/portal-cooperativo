# Portal Cooperativo (Frontend Demo)

Este proyecto es la aplicación front-end para el "Portal Cooperativo", desarrollada con un enfoque mobile-first y una estética moderna de Claymorfismo. **Actualmente se encuentra en su fase de Demo Funcional**, completamente preparada a nivel arquitectónico para escalar hacia una versión real de producción.

## Camino Técnico y Despliegue (Roadmap)

### 1. Repositorio y Hosting
- **Control de Versiones:** El proyecto completo debe inicializarse como un repositorio principal en **GitHub** para manejar el historial de cambios y facilitar la colaboración.
- **Despliegue de la Demo (Hosting):** La aplicación React + Vite está optimizada para ser desplegada gratuitamente en **Vercel** o **Netlify**. Con conectar el repositorio de GitHub a Vercel, se obtendrá un enlace público al instante para mostrar la demo a los directivos de la cooperativa.

### 2. Fuente de Datos Futura (Backend)
Actualmente, los datos de la aplicación se consumen desde el archivo local `src/data/mockData.ts` de forma **estrictamente temporal** para la demo. 

En una versión real, la aplicación se alimentará a través de una API conectada a una base de datos. La fuente real de esta información podría ser:
- **Etapa Inicial (MVP):** Un archivo Excel o Google Sheets conectado mediante herramientas low-code.
- **Etapa de Crecimiento:** Una base de datos relacional robusta (como PostgreSQL, MySQL, Supabase, Firebase o Neon).
- **Etapa de Integración:** Un sistema administrativo / Core Bancario pre-existente de la cooperativa (si ya cuentan con uno).

La información indispensable que el Backend deberá proveer a esta interfaz es:
- Padrón de Socios y Cédulas.
- Aportes mensuales y aportes atrasados (montos y meses).
- Préstamos otorgados (cuotas pagadas, cuotas vencidas y próximos vencimientos).
- Pagos pendientes globales.
- Historial de Movimientos de Ahorros.
- Estado general del socio y calificación dinámica para Préstamo Express.

## Arquitectura Preparada para la Realidad
Para asegurar que la transición de "Demo" a "Producto Real" sea indolora, la arquitectura fue diseñada separando estrictamente la Vista de los Datos:

- **Frontend:** React + Vite (Ya implementado).
- **Capa de Servicios (`src/services/`):** Aquí viven las funciones (`authService`, `memberService`, etc.) que hoy devuelven promesas simuladas, pero que mañana usarán `axios` o `fetch` para comunicarse con el Backend. Las pantallas de UI (Dashboard, Aportes, etc.) *no necesitan ser modificadas* cuando se cambie la fuente de datos.
- **Autenticación (Login Real):** Protegida mediante `ProtectedRoute.tsx`. Preparado para intercambiar la lógica de validación local por la verificación de un Token JWT provisto por el backend.
- **Panel Administrativo:** Base creada (`/admin`). Listo para expandirse con gestión, carga y actualización de datos de los socios una vez exista el Backend.

---

## Tecnologías Utilizadas
- **React 18** + **Vite** + **TypeScript**
- **React Router v6** (SPA)
- **CSS3** (Estilos nativos aplicando "Claymorfismo")

## Estructura de Carpetas Principal
- `src/config`: Contiene `appConfig.ts` donde se define el nombre temporal y la URL futura del Backend.
- `src/components`: Componentes visuales reutilizables (`Badge`, `StatCard`).
- `src/layouts`: Layout con menú de navegación lateral/mobile.
- `src/pages`: Las vistas de la aplicación (`Login`, `Dashboard`, `Aportes`, `AdminPanel`, etc.).
- `src/services`: Punto de integración futuro con el Backend real.

## Cómo ejecutar localmente
1. Instalación de dependencias:
   ```bash
   npm install
   ```
2. Ejecución del servidor local:
   ```bash
   npm run dev
   ```
3. Construcción para Vercel / Producción:
   ```bash
   npm run build
   ```

## Pruebas de Autenticación (Demo)
- **Para Socios:** Cédula: `1234567` | Contraseña: `(Cualquiera)`
- **Para Administrador:** Cédula: `admin` | Contraseña: `(Cualquiera)`

> **Nota Final:** El nombre "Portal Cooperativo" es temporal, y se encuentra centralizado en `src/config/appConfig.ts` para facilitar el rebranding futuro.
