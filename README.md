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

## Cómo ejecutar localmente
1. Cloná este repositorio.
2. Asegurate de estar en la carpeta correcta: `cd react-app/portal-cooperativo`.
3. Ejecutá `npm install` para instalar todas las dependencias.
4. Ejecutá `npm run dev` para iniciar el servidor local.

## Siguientes Pasos
Actualmente la interfaz administrativa es interactiva y funcional a nivel demostrativo. En próximas etapas de desarrollo se implementará la lógica real para procesar documentos de Excel, exportación de PDFs y conexión en vivo al panel administrativo en Supabase.
