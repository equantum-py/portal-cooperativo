# Portal Cooperativo

Aplicación Frontend en React + Vite para la cooperativa. Este proyecto está preparado para funcionar tanto en **Modo Demo** (con datos estáticos) como en **Modo Producción** (conectado a una base de datos PostgreSQL en Supabase).

## Experiencia Dual: Socio vs Administrador
La plataforma ofrece una experiencia totalmente segregada dependiendo del rol del usuario:
- **Vista de Socio (Cédula de prueba: `1234567`):** Accede a su estado de cuenta personal, listado de aportes, ahorros, préstamos y pagos pendientes.
- **Suite Administrativa (Cédula de prueba: `admin`):** Accede a un panel de control financiero complejo (`/dashboard/admin`), que incluye gestión del padrón de socios, resumen del flujo de caja, control de cuotas vencidas, generación de reportes y herramientas para simulación de importación/exportación de bases de datos Excel.

## Configuración y Variables de Entorno

El proyecto incluye un archivo `.env.example`. Para conectarlo a Supabase, debes crear un archivo `.env` en la raíz (junto a `package.json`) con las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui
```

### Configurar Vercel
Al desplegar en Vercel, deberás cargar estas mismas dos variables (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`) en la configuración del proyecto (Settings -> Environment Variables).

## Modo Demo vs Modo Supabase
El comportamiento de la aplicación está gobernado por el archivo `src/config/appConfig.ts`:
- Si `modoDemo: true`, la aplicación utilizará los datos ampliados de `src/data/mockData.ts` (Incluyendo el listado del padrón y el flujo de caja).
- Si `modoDemo: false`, la aplicación utilizará el cliente de Supabase (`src/lib/supabaseClient.ts`) e intentará autenticar usuarios reales contra tu base de datos y leer la información mediante RLS.

## Links de acceso

- **Portal del socio**: `https://asoapp.vercel.app`
- **Panel administrativo**: `https://asoapp.vercel.app/admin`

### Credenciales demo

**Socio:**
- Cédula: `1234567`
- PIN: `1234`

**Administrador:**
- Usuario: `admin`
- PIN: `1234`

> **Nota:** Actualmente ambos accesos funcionan dentro del mismo proyecto Vercel. En producción se podrán usar subdominios separados, por ejemplo `socios.dominio.com.py` y `admin.dominio.com.py`.

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
2. Asegurate de estar en la carpeta correcta: `cd react-app/portal-cooperativo`.
3. Ejecutá `npm install` para instalar todas las dependencias.
4. Ejecutá `npm run dev` para iniciar el servidor local.

## Preparación Técnica
- En modo demo, los datos importados se guardan en `localStorage`.
- En modo producción, los datos importados se guardarán en Supabase.
- El panel administrativo será la única fuente de carga y actualización de: socios, aportes, préstamos, cuotas, pagos, ahorros, y notificaciones.
