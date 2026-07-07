# Portal Cooperativo

Aplicación Frontend en React + Vite para la cooperativa. Este proyecto está preparado para funcionar tanto en **Modo Demo** (con datos estáticos/localStorage) como en **Modo Supabase** (con Supabase Auth y tablas PostgreSQL protegidas con RLS).

## Experiencia Dual: Socio vs Administrador
La plataforma ofrece una experiencia segregada dependiendo del rol del usuario:
- **Vista de Socio (cédula demo: `1234567`):** Accede a su estado de cuenta personal, listado de aportes, ahorros, préstamos y pagos pendientes.
- **Suite Administrativa (usuario demo: `admin`):** Accede a un panel de control financiero (`/dashboard/admin`) con gestión de socios, aportes, préstamos, pagos, flujo de caja, reportes e importación/exportación demo.

## Configuración y variables de entorno

Crear un archivo `.env` en la raíz con:

```env
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui
VITE_MODO_DEMO=true
```

### `VITE_MODO_DEMO=true`

Modo recomendado mientras se valida el producto y el despliegue actual.

- El portal socio mantiene el login demo por cédula `1234567`.
- El panel admin mantiene el login demo con usuario `admin` y PIN `1234`.
- Los datos siguen viniendo de `mockData`, `demoStore` y `localStorage`.
- No requiere Supabase para operar la demo, aunque las variables estén cargadas.

### `VITE_MODO_DEMO=false`

Modo preparado para iniciar conexión real con Supabase de forma controlada.

- El login administrativo usa Supabase Auth con email y contraseña.
- Después del login, la app valida que exista un registro en `admin_profiles` para `auth.users.id` con `activo=true`.
- Si el perfil admin no existe o está inactivo, la app cierra la sesión Supabase y muestra error.
- La capa inicial `supabaseDataService` queda preparada para leer `socios`, `aportes`, `prestamos`, `pagos`, `cuentas_ahorro`, `movimientos_ahorro`, `notificaciones` y `configuracion_general`.

> Importante: el login real del socio todavía queda pendiente de definición. Hay que decidir si será por contraseña, PIN, fecha de nacimiento, código SMS/magic link o una combinación con Supabase Auth. Hasta definirlo, el modo real del socio no debe habilitarse como flujo productivo.

### Configurar Vercel

En Vercel cargar:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MODO_DEMO`

Para mantener la demo actual, usar `VITE_MODO_DEMO=true`.

## Base de datos Supabase

Archivos incluidos:

- `database_schema.sql`: crea estructura de tablas, relaciones, índices, triggers y políticas RLS.
- `supabase_seed_demo.sql`: inserta datos demo idempotentes para validar la base desde SQL Editor.

Estos archivos se ejecutan manualmente desde Supabase SQL Editor. La app no ejecuta migraciones automáticamente.

## Links de acceso

- **Portal del socio**: `https://asoapp.vercel.app`
- **Panel administrativo**: `https://asoapp.vercel.app/admin`

### Credenciales demo

**Socio:**
- Cédula: `1234567`

**Administrador:**
- Usuario: `admin`
- PIN: `1234`

## Flujo de Datos Reales (Producción)

El flujo real planificado será el siguiente:

1. Excel de la cooperativa.
2. Importar desde Panel Administrativo.
3. Validar columnas y datos.
4. Guardar en Supabase/PostgreSQL.
5. El panel admin se alimenta de esos datos.
6. Cada socio ve únicamente sus propios datos en la app.

## Cómo ejecutar localmente

1. Cloná este repositorio.
2. Asegurate de estar en la carpeta correcta.
3. Ejecutá `npm install` para instalar dependencias.
4. Configurá `.env` según el modo deseado.
5. Ejecutá `npm run dev` para iniciar el servidor local.

## Preparación Técnica

- En modo demo, los datos importados se guardan en `localStorage`.
- En modo Supabase, los datos reales viven en tablas PostgreSQL con RLS.
- El panel administrativo será la fuente de carga y actualización de socios, aportes, préstamos, cuotas, pagos, ahorros y notificaciones.
- La integración real de pantallas debe hacerse gradualmente para no romper el modo demo.
