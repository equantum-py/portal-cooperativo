# Portal Cooperativo

Aplicación Frontend en React + Vite para la cooperativa. Este proyecto está preparado para funcionar tanto en **Modo Demo** (con datos estáticos) como en **Modo Producción** (conectado a una base de datos PostgreSQL en Supabase).

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
- Si `modoDemo: true`, la aplicación utilizará los datos de `src/data/mockData.ts`. Las credenciales de acceso no importan (salvo la cédula `1234567` para socio y `admin` para administrador).
- Si `modoDemo: false`, la aplicación utilizará el cliente de Supabase (`src/lib/supabaseClient.ts`) e intentará autenticar usuarios reales contra tu base de datos y leer la información mediante RLS.

## Cómo ejecutar localmente
1. Cloná este repositorio.
2. Asegurate de estar en la carpeta correcta: `cd react-app/portal-cooperativo`.
3. Ejecutá `npm install` para instalar todas las dependencias (incluyendo `@supabase/supabase-js`).
4. Ejecutá `npm run dev` para iniciar el servidor local.

## Siguientes Pasos
Actualmente la aplicación tiene la conexión preparada a nivel de servicios (`src/services/`). El siguiente paso es desactivar el modo demo (`modoDemo: false`) una vez que el proyecto en Supabase esté creado, la estructura SQL haya sido inyectada y los datos reales estén cargados.
