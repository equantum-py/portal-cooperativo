-- =============================================================
-- Portal Cooperativo - Supabase Database Schema
-- =============================================================
-- Purpose:
--   First production-ready database structure for the cooperative portal.
--   This schema is prepared for Supabase/PostgreSQL and keeps demo mode
--   untouched in the React application.
--
-- Important:
--   - Do not run this automatically from the app.
--   - Review policies against the final Supabase Auth model before going live.
--   - RLS is enabled on every application table.
--   - Admin policies depend on public.is_admin(), backed by admin_profiles.
--   - Socio policies depend on socios.user_id = auth.uid().
-- =============================================================

-- Required for gen_random_uuid().
create extension if not exists pgcrypto;

-- =============================================================
-- Utility functions
-- =============================================================

-- Keeps updated_at columns current on updates.
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================
-- 1. Socios
-- =============================================================

create table if not exists public.socios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  nombre text not null,
  apellido text,
  nombre_completo text,
  cedula text not null unique,
  numero_socio text unique,
  telefono text,
  email text,
  direccion text,
  ciudad text,
  estado text not null default 'activo'
    check (estado in ('activo', 'inactivo', 'atrasado', 'pendiente')),
  fecha_ingreso date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.socios is 'Socios de la cooperativa. user_id permite vincular cada socio con auth.users cuando se habilite Supabase Auth.';

-- =============================================================
-- 2. Aportes
-- =============================================================

create table if not exists public.aportes (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.socios(id) on delete cascade,
  periodo text not null,
  monto numeric(14, 2) not null default 0 check (monto >= 0),
  fecha_vencimiento date,
  fecha_pago date null,
  estado text not null default 'pendiente'
    check (estado in ('pagado', 'pendiente', 'atrasado', 'anulado')),
  observacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint aportes_socio_periodo_unique unique (socio_id, periodo)
);

comment on table public.aportes is 'Aportes periódicos de socios. periodo puede usarse como YYYY-MM.';

-- =============================================================
-- 3. Prestamos
-- =============================================================

create table if not exists public.prestamos (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.socios(id) on delete cascade,
  monto_concedido numeric(14, 2) not null default 0 check (monto_concedido >= 0),
  fecha_otorgamiento date,
  cantidad_cuotas integer not null default 0 check (cantidad_cuotas >= 0),
  tasa_interes numeric(7, 4) null check (tasa_interes is null or tasa_interes >= 0),
  cuota_mensual numeric(14, 2) not null default 0 check (cuota_mensual >= 0),
  estado text not null default 'activo'
    check (estado in ('activo', 'cancelado', 'atrasado', 'pendiente', 'rechazado')),
  observacion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.prestamos is 'Prestamos concedidos a socios.';

-- =============================================================
-- 4. Cuotas de prestamo
-- =============================================================

create table if not exists public.cuotas_prestamo (
  id uuid primary key default gen_random_uuid(),
  prestamo_id uuid not null references public.prestamos(id) on delete cascade,
  numero_cuota integer not null check (numero_cuota > 0),
  monto numeric(14, 2) not null default 0 check (monto >= 0),
  fecha_vencimiento date,
  fecha_pago date null,
  estado text not null default 'pendiente'
    check (estado in ('pagada', 'pendiente', 'vencida', 'anulada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cuotas_prestamo_numero_unique unique (prestamo_id, numero_cuota)
);

comment on table public.cuotas_prestamo is 'Plan de cuotas asociado a cada prestamo.';

-- =============================================================
-- 5. Pagos
-- =============================================================

create table if not exists public.pagos (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.socios(id) on delete cascade,
  aporte_id uuid null references public.aportes(id) on delete set null,
  cuota_prestamo_id uuid null references public.cuotas_prestamo(id) on delete set null,
  concepto text,
  tipo_pago text not null default 'otro'
    check (tipo_pago in ('aporte', 'cuota_prestamo', 'ahorro', 'otro')),
  monto numeric(14, 2) not null default 0 check (monto >= 0),
  estado text not null default 'pendiente'
    check (estado in ('pagado', 'pendiente', 'vencido', 'anulado')),
  fecha_vencimiento date null,
  fecha_pago date null,
  metodo_pago text not null default 'otro'
    check (metodo_pago in ('efectivo', 'transferencia', 'giro', 'caja', 'tarjeta', 'otro')),
  referencia_externa text,
  observacion text,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.pagos is 'Pagos pendientes y realizados. Puede enlazar aportes o cuotas de prestamo.';

-- =============================================================
-- 6. Cuentas de ahorro
-- =============================================================

create table if not exists public.cuentas_ahorro (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references public.socios(id) on delete cascade,
  numero_cuenta text unique,
  saldo_disponible numeric(14, 2) not null default 0 check (saldo_disponible >= 0),
  estado text not null default 'activa'
    check (estado in ('activa', 'inactiva', 'bloqueada', 'cerrada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.cuentas_ahorro is 'Cuentas de ahorro de socios.';

-- =============================================================
-- 7. Movimientos de ahorro
-- =============================================================

create table if not exists public.movimientos_ahorro (
  id uuid primary key default gen_random_uuid(),
  cuenta_ahorro_id uuid not null references public.cuentas_ahorro(id) on delete cascade,
  tipo text not null check (tipo in ('deposito', 'retiro', 'interes', 'ajuste')),
  concepto text,
  monto numeric(14, 2) not null default 0,
  fecha date not null default current_date,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.movimientos_ahorro is 'Movimientos transaccionales de cuentas de ahorro.';

-- =============================================================
-- 8. Notificaciones
-- =============================================================

create table if not exists public.notificaciones (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid null references public.socios(id) on delete cascade,
  destinatario_tipo text not null default 'socio'
    check (destinatario_tipo in ('todos', 'activos', 'atrasados', 'socio')),
  tipo text not null default 'info'
    check (tipo in ('info', 'success', 'warning', 'danger')),
  titulo text not null,
  mensaje text not null,
  canal text not null default 'app'
    check (canal in ('app', 'email', 'whatsapp', 'sms')),
  prioridad text not null default 'normal'
    check (prioridad in ('baja', 'normal', 'alta', 'urgente')),
  leida boolean not null default false,
  fecha_lectura timestamptz null,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.notificaciones is 'Notificaciones para socios. Para lectura individual de notificaciones globales puede agregarse una tabla notificacion_destinatarios en una fase posterior.';

-- =============================================================
-- 9. Administradores
-- =============================================================

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nombre text,
  email text,
  rol text not null default 'admin'
    check (rol in ('admin', 'super_admin', 'operador')),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.admin_profiles is 'Perfiles administrativos vinculados a auth.users.';

-- Admin helper depends on admin_profiles, so it is created after that table.
-- Returns true when the authenticated Supabase user has an active admin profile.
-- SECURITY DEFINER is used so RLS on admin_profiles does not block this helper.
-- Revisit this function after finalizing the production auth/roles model.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.activo = true
  );
$$;


-- =============================================================
-- 10. Configuracion general
-- =============================================================

create table if not exists public.configuracion_general (
  id uuid primary key default gen_random_uuid(),
  nombre_cooperativa text,
  nombre_portal text,
  telefono text,
  email text,
  whatsapp text,
  direccion text,
  ciudad text,
  monto_aporte_defecto numeric(14, 2) check (monto_aporte_defecto is null or monto_aporte_defecto >= 0),
  dia_vencimiento_aporte integer check (dia_vencimiento_aporte is null or dia_vencimiento_aporte between 1 and 31),
  moneda text not null default 'PYG',
  max_cuotas integer check (max_cuotas is null or max_cuotas > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.configuracion_general is 'Configuracion global del portal cooperativo.';

-- =============================================================
-- 11. Plantillas de notificacion
-- =============================================================

create table if not exists public.plantillas_notificacion (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  nombre text,
  titulo text,
  mensaje text,
  tipo text not null default 'info'
    check (tipo in ('info', 'success', 'warning', 'danger')),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.plantillas_notificacion is 'Plantillas reutilizables para comunicaciones y alertas.';

-- =============================================================
-- 12. Importacion Excel/CSV
-- =============================================================

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  filename text,
  total_rows integer not null default 0 check (total_rows >= 0),
  success_rows integer not null default 0 check (success_rows >= 0),
  error_rows integer not null default 0 check (error_rows >= 0),
  status text not null default 'pendiente'
    check (status in ('pendiente', 'procesando', 'completado', 'completado_con_errores', 'fallido')),
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.import_batches is 'Cabecera de procesos de importacion CSV/Excel.';

create table if not exists public.import_batch_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  row_number integer not null check (row_number > 0),
  raw_data jsonb not null default '{}'::jsonb,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'valido', 'error', 'importado', 'omitido')),
  error_message text,
  created_at timestamptz not null default now()
);

comment on table public.import_batch_rows is 'Detalle fila por fila de cada importacion, incluyendo datos crudos y errores de validacion.';

-- =============================================================
-- 13. Audit logs
-- =============================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid null references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.audit_logs is 'Bitacora de acciones relevantes para auditoria operativa.';

-- =============================================================
-- Indexes
-- =============================================================

create index if not exists idx_socios_cedula on public.socios (cedula);
create index if not exists idx_socios_numero_socio on public.socios (numero_socio);
create index if not exists idx_socios_user_id on public.socios (user_id);

create index if not exists idx_aportes_socio_id on public.aportes (socio_id);
create index if not exists idx_aportes_estado on public.aportes (estado);
create index if not exists idx_aportes_fecha_vencimiento on public.aportes (fecha_vencimiento);

create index if not exists idx_prestamos_socio_id on public.prestamos (socio_id);

create index if not exists idx_cuotas_prestamo_prestamo_id on public.cuotas_prestamo (prestamo_id);
create index if not exists idx_cuotas_prestamo_estado on public.cuotas_prestamo (estado);

create index if not exists idx_pagos_socio_id on public.pagos (socio_id);
create index if not exists idx_pagos_estado on public.pagos (estado);

create index if not exists idx_cuentas_ahorro_socio_id on public.cuentas_ahorro (socio_id);
create index if not exists idx_movimientos_ahorro_cuenta_id on public.movimientos_ahorro (cuenta_ahorro_id);

create index if not exists idx_notificaciones_socio_id on public.notificaciones (socio_id);
create index if not exists idx_notificaciones_leida on public.notificaciones (leida);

create index if not exists idx_import_batch_rows_batch_id on public.import_batch_rows (batch_id);
create index if not exists idx_audit_logs_actor_user_id on public.audit_logs (actor_user_id);
create index if not exists idx_audit_logs_entity on public.audit_logs (entity, entity_id);

-- =============================================================
-- updated_at triggers
-- =============================================================

drop trigger if exists trg_socios_updated_at on public.socios;
create trigger trg_socios_updated_at
before update on public.socios
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_aportes_updated_at on public.aportes;
create trigger trg_aportes_updated_at
before update on public.aportes
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_prestamos_updated_at on public.prestamos;
create trigger trg_prestamos_updated_at
before update on public.prestamos
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_cuotas_prestamo_updated_at on public.cuotas_prestamo;
create trigger trg_cuotas_prestamo_updated_at
before update on public.cuotas_prestamo
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_pagos_updated_at on public.pagos;
create trigger trg_pagos_updated_at
before update on public.pagos
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_cuentas_ahorro_updated_at on public.cuentas_ahorro;
create trigger trg_cuentas_ahorro_updated_at
before update on public.cuentas_ahorro
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_admin_profiles_updated_at on public.admin_profiles;
create trigger trg_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_configuracion_general_updated_at on public.configuracion_general;
create trigger trg_configuracion_general_updated_at
before update on public.configuracion_general
for each row execute function public.update_updated_at_column();

drop trigger if exists trg_plantillas_notificacion_updated_at on public.plantillas_notificacion;
create trigger trg_plantillas_notificacion_updated_at
before update on public.plantillas_notificacion
for each row execute function public.update_updated_at_column();

-- =============================================================
-- Row Level Security
-- =============================================================

alter table public.socios enable row level security;
alter table public.aportes enable row level security;
alter table public.prestamos enable row level security;
alter table public.cuotas_prestamo enable row level security;
alter table public.pagos enable row level security;
alter table public.cuentas_ahorro enable row level security;
alter table public.movimientos_ahorro enable row level security;
alter table public.notificaciones enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.configuracion_general enable row level security;
alter table public.plantillas_notificacion enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_batch_rows enable row level security;
alter table public.audit_logs enable row level security;

-- =============================================================
-- RLS policies - Socios
-- =============================================================

drop policy if exists "Admins can manage socios" on public.socios;
create policy "Admins can manage socios"
on public.socios
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Socios can view own profile" on public.socios;
create policy "Socios can view own profile"
on public.socios
for select
to authenticated
using (user_id = auth.uid());

-- Socios cannot update their own financial/profile data in this first version.
-- Profile update requests should go through solicitudes or an admin workflow.

-- =============================================================
-- RLS policies - Aportes
-- =============================================================

drop policy if exists "Admins can manage aportes" on public.aportes;
create policy "Admins can manage aportes"
on public.aportes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Socios can view own aportes" on public.aportes;
create policy "Socios can view own aportes"
on public.aportes
for select
to authenticated
using (
  exists (
    select 1 from public.socios s
    where s.id = aportes.socio_id
      and s.user_id = auth.uid()
  )
);

-- =============================================================
-- RLS policies - Prestamos
-- =============================================================

drop policy if exists "Admins can manage prestamos" on public.prestamos;
create policy "Admins can manage prestamos"
on public.prestamos
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Socios can view own prestamos" on public.prestamos;
create policy "Socios can view own prestamos"
on public.prestamos
for select
to authenticated
using (
  exists (
    select 1 from public.socios s
    where s.id = prestamos.socio_id
      and s.user_id = auth.uid()
  )
);

-- =============================================================
-- RLS policies - Cuotas de prestamo
-- =============================================================

drop policy if exists "Admins can manage cuotas_prestamo" on public.cuotas_prestamo;
create policy "Admins can manage cuotas_prestamo"
on public.cuotas_prestamo
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Socios can view own cuotas_prestamo" on public.cuotas_prestamo;
create policy "Socios can view own cuotas_prestamo"
on public.cuotas_prestamo
for select
to authenticated
using (
  exists (
    select 1
    from public.prestamos p
    join public.socios s on s.id = p.socio_id
    where p.id = cuotas_prestamo.prestamo_id
      and s.user_id = auth.uid()
  )
);

-- =============================================================
-- RLS policies - Pagos
-- =============================================================

drop policy if exists "Admins can manage pagos" on public.pagos;
create policy "Admins can manage pagos"
on public.pagos
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Socios can view own pagos" on public.pagos;
create policy "Socios can view own pagos"
on public.pagos
for select
to authenticated
using (
  exists (
    select 1 from public.socios s
    where s.id = pagos.socio_id
      and s.user_id = auth.uid()
  )
);

-- =============================================================
-- RLS policies - Cuentas de ahorro
-- =============================================================

drop policy if exists "Admins can manage cuentas_ahorro" on public.cuentas_ahorro;
create policy "Admins can manage cuentas_ahorro"
on public.cuentas_ahorro
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Socios can view own cuentas_ahorro" on public.cuentas_ahorro;
create policy "Socios can view own cuentas_ahorro"
on public.cuentas_ahorro
for select
to authenticated
using (
  exists (
    select 1 from public.socios s
    where s.id = cuentas_ahorro.socio_id
      and s.user_id = auth.uid()
  )
);

-- =============================================================
-- RLS policies - Movimientos de ahorro
-- =============================================================

drop policy if exists "Admins can manage movimientos_ahorro" on public.movimientos_ahorro;
create policy "Admins can manage movimientos_ahorro"
on public.movimientos_ahorro
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Socios can view own movimientos_ahorro" on public.movimientos_ahorro;
create policy "Socios can view own movimientos_ahorro"
on public.movimientos_ahorro
for select
to authenticated
using (
  exists (
    select 1
    from public.cuentas_ahorro ca
    join public.socios s on s.id = ca.socio_id
    where ca.id = movimientos_ahorro.cuenta_ahorro_id
      and s.user_id = auth.uid()
  )
);

-- =============================================================
-- RLS policies - Notificaciones
-- =============================================================

drop policy if exists "Admins can manage notificaciones" on public.notificaciones;
create policy "Admins can manage notificaciones"
on public.notificaciones
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Socios can view own notificaciones" on public.notificaciones;
create policy "Socios can view own notificaciones"
on public.notificaciones
for select
to authenticated
using (
  socio_id is null
  or exists (
    select 1 from public.socios s
    where s.id = notificaciones.socio_id
      and s.user_id = auth.uid()
  )
);

-- Allows a socio to mark only their own notifications as read/unread.
drop policy if exists "Socios can update read status on own notificaciones" on public.notificaciones;
create policy "Socios can update read status on own notificaciones"
on public.notificaciones
for update
to authenticated
using (
  socio_id is not null
  and exists (
    select 1 from public.socios s
    where s.id = notificaciones.socio_id
      and s.user_id = auth.uid()
  )
)
with check (
  socio_id is not null
  and exists (
    select 1 from public.socios s
    where s.id = notificaciones.socio_id
      and s.user_id = auth.uid()
  )
);

-- =============================================================
-- RLS policies - Admin profiles
-- =============================================================

drop policy if exists "Admins can view admin profiles" on public.admin_profiles;
create policy "Admins can view admin profiles"
on public.admin_profiles
for select
to authenticated
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "Admins can manage admin profiles" on public.admin_profiles;
create policy "Admins can manage admin profiles"
on public.admin_profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Bootstrap note:
--   The first admin profile may need to be inserted by a Supabase service role
--   or directly in the SQL editor before admin-only policies are useful.

-- =============================================================
-- RLS policies - Configuracion y plantillas
-- =============================================================

drop policy if exists "Admins can manage configuracion_general" on public.configuracion_general;
create policy "Admins can manage configuracion_general"
on public.configuracion_general
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can view configuracion_general" on public.configuracion_general;
create policy "Authenticated users can view configuracion_general"
on public.configuracion_general
for select
to authenticated
using (true);

drop policy if exists "Admins can manage plantillas_notificacion" on public.plantillas_notificacion;
create policy "Admins can manage plantillas_notificacion"
on public.plantillas_notificacion
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can view plantillas_notificacion" on public.plantillas_notificacion;
create policy "Admins can view plantillas_notificacion"
on public.plantillas_notificacion
for select
to authenticated
using (public.is_admin());

-- =============================================================
-- RLS policies - Importaciones
-- =============================================================

drop policy if exists "Admins can manage import_batches" on public.import_batches;
create policy "Admins can manage import_batches"
on public.import_batches
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage import_batch_rows" on public.import_batch_rows;
create policy "Admins can manage import_batch_rows"
on public.import_batch_rows
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =============================================================
-- RLS policies - Audit logs
-- =============================================================

drop policy if exists "Admins can view audit_logs" on public.audit_logs;
create policy "Admins can view audit_logs"
on public.audit_logs
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert audit_logs" on public.audit_logs;
create policy "Admins can insert audit_logs"
on public.audit_logs
for insert
to authenticated
with check (public.is_admin());

-- =============================================================
-- End of schema
-- =============================================================
