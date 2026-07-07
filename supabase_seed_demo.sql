-- =============================================================
-- Portal Cooperativo - Supabase Demo Seed Data
-- =============================================================
-- Purpose:
--   Insert realistic demo records to validate the Supabase database created by
--   database_schema.sql.
--
-- How to use:
--   1. Open Supabase Dashboard > SQL Editor.
--   2. Paste this file contents.
--   3. Run it with the default SQL Editor role (usually postgres).
--
-- Important:
--   - This seed does NOT create auth.users.
--   - This seed does NOT create admin_profiles.
--   - This seed does NOT disable RLS.
--   - This seed is intended for demo/test data only.
--   - Inserts are written to be idempotent where possible, so running it more
--     than once should not duplicate the seeded business records.
-- =============================================================

begin;

-- =============================================================
-- 1. Configuracion general
-- =============================================================

insert into public.configuracion_general (
  nombre_cooperativa,
  nombre_portal,
  telefono,
  email,
  whatsapp,
  direccion,
  ciudad,
  monto_aporte_defecto,
  dia_vencimiento_aporte,
  moneda,
  max_cuotas
)
select
  'Cooperativa Demo',
  'Portal del Socio',
  '021 123 456',
  'contacto@cooperativademo.com.py',
  '0981 123 456',
  'Av. Demo 1234',
  'Asunción',
  100000,
  10,
  'PYG',
  24
where not exists (
  select 1
  from public.configuracion_general cg
  where cg.nombre_cooperativa = 'Cooperativa Demo'
    and cg.nombre_portal = 'Portal del Socio'
);

-- =============================================================
-- 2. Socios
-- =============================================================

insert into public.socios (
  nombre,
  apellido,
  nombre_completo,
  cedula,
  numero_socio,
  telefono,
  email,
  direccion,
  ciudad,
  estado,
  fecha_ingreso
)
values
  ('Juan', 'Pérez', 'Juan Pérez', '1234567', 'SOC-001', '0981123456', 'juan.perez@example.com', 'Barrio Centro', 'Asunción', 'atrasado', '2022-01-15'),
  ('María', 'González', 'María González', '2345678', 'SOC-002', '0982234567', 'maria.gonzalez@example.com', 'Barrio Las Mercedes', 'Asunción', 'activo', '2021-08-10'),
  ('Carlos', 'Ramírez', 'Carlos Ramírez', '3456789', 'SOC-003', '0983345678', 'carlos.ramirez@example.com', 'Barrio Villa Morra', 'Asunción', 'activo', '2023-03-20')
on conflict (cedula) do update
set
  nombre = excluded.nombre,
  apellido = excluded.apellido,
  nombre_completo = excluded.nombre_completo,
  numero_socio = excluded.numero_socio,
  telefono = excluded.telefono,
  email = excluded.email,
  direccion = excluded.direccion,
  ciudad = excluded.ciudad,
  estado = excluded.estado,
  fecha_ingreso = excluded.fecha_ingreso;

-- =============================================================
-- 3. Cuentas de ahorro
-- =============================================================

insert into public.cuentas_ahorro (
  socio_id,
  numero_cuenta,
  saldo_disponible,
  estado
)
select s.id, seed.numero_cuenta, seed.saldo_disponible, 'activa'
from (
  values
    ('1234567', 'AHO-001', 3500000::numeric),
    ('2345678', 'AHO-002', 12000000::numeric),
    ('3456789', 'AHO-003', 1500000::numeric)
) as seed(cedula, numero_cuenta, saldo_disponible)
join public.socios s on s.cedula = seed.cedula
on conflict (numero_cuenta) do update
set
  socio_id = excluded.socio_id,
  saldo_disponible = excluded.saldo_disponible,
  estado = excluded.estado;

-- =============================================================
-- 4. Movimientos de ahorro
-- =============================================================

insert into public.movimientos_ahorro (
  cuenta_ahorro_id,
  tipo,
  concepto,
  monto,
  fecha
)
select ca.id, seed.tipo, seed.concepto, seed.monto, seed.fecha::date
from (
  values
    ('AHO-001', 'deposito', 'Depósito mensual', 500000::numeric, '2026-06-01'),
    ('AHO-001', 'interes', 'Interés mensual acreditado', 25000::numeric, '2026-06-30'),
    ('AHO-001', 'retiro', 'Retiro por caja', -150000::numeric, '2026-07-02'),
    ('AHO-002', 'deposito', 'Depósito de ahorro programado', 1000000::numeric, '2026-06-05'),
    ('AHO-002', 'interes', 'Interés mensual acreditado', 60000::numeric, '2026-06-30'),
    ('AHO-003', 'deposito', 'Depósito inicial', 300000::numeric, '2026-06-10'),
    ('AHO-003', 'ajuste', 'Ajuste administrativo positivo', 50000::numeric, '2026-07-01')
) as seed(numero_cuenta, tipo, concepto, monto, fecha)
join public.cuentas_ahorro ca on ca.numero_cuenta = seed.numero_cuenta
where not exists (
  select 1
  from public.movimientos_ahorro ma
  where ma.cuenta_ahorro_id = ca.id
    and ma.tipo = seed.tipo
    and ma.concepto = seed.concepto
    and ma.monto = seed.monto
    and ma.fecha = seed.fecha::date
);

-- =============================================================
-- 5. Aportes
-- =============================================================

insert into public.aportes (
  socio_id,
  periodo,
  monto,
  fecha_vencimiento,
  fecha_pago,
  estado,
  observacion
)
select s.id, seed.periodo, seed.monto, seed.fecha_vencimiento::date, seed.fecha_pago::date, seed.estado, seed.observacion
from (
  values
    -- Juan Pérez: histórico mixto con atrasos y periodo actual pendiente.
    ('1234567', '2026-04', 100000::numeric, '2026-04-10', '2026-04-09', 'pagado', 'Aporte pagado en fecha'),
    ('1234567', '2026-05', 100000::numeric, '2026-05-10', null, 'atrasado', 'Aporte vencido pendiente'),
    ('1234567', '2026-06', 100000::numeric, '2026-06-10', null, 'atrasado', 'Aporte vencido pendiente'),
    ('1234567', '2026-07', 100000::numeric, '2026-07-10', null, 'pendiente', 'Periodo actual pendiente'),
    -- María González: al día.
    ('2345678', '2026-05', 100000::numeric, '2026-05-10', '2026-05-08', 'pagado', 'Aporte pagado'),
    ('2345678', '2026-06', 100000::numeric, '2026-06-10', '2026-06-07', 'pagado', 'Aporte pagado'),
    ('2345678', '2026-07', 100000::numeric, '2026-07-10', '2026-07-05', 'pagado', 'Aporte pagado'),
    -- Carlos Ramírez: al día con periodo actual pagado.
    ('3456789', '2026-05', 100000::numeric, '2026-05-10', '2026-05-09', 'pagado', 'Aporte pagado'),
    ('3456789', '2026-06', 100000::numeric, '2026-06-10', '2026-06-10', 'pagado', 'Aporte pagado'),
    ('3456789', '2026-07', 100000::numeric, '2026-07-10', '2026-07-06', 'pagado', 'Aporte pagado')
) as seed(cedula, periodo, monto, fecha_vencimiento, fecha_pago, estado, observacion)
join public.socios s on s.cedula = seed.cedula
on conflict (socio_id, periodo) do update
set
  monto = excluded.monto,
  fecha_vencimiento = excluded.fecha_vencimiento,
  fecha_pago = excluded.fecha_pago,
  estado = excluded.estado,
  observacion = excluded.observacion;

-- =============================================================
-- 6. Prestamos
-- =============================================================

insert into public.prestamos (
  socio_id,
  monto_concedido,
  fecha_otorgamiento,
  cantidad_cuotas,
  tasa_interes,
  cuota_mensual,
  estado,
  observacion
)
select s.id, seed.monto_concedido, seed.fecha_otorgamiento::date, seed.cantidad_cuotas, seed.tasa_interes, seed.cuota_mensual, seed.estado, seed.observacion
from (
  values
    ('1234567', 10000000::numeric, '2025-11-15', 20, 18.0000::numeric, 650000::numeric, 'activo', 'Préstamo activo con una cuota vencida'),
    ('2345678', 5000000::numeric, '2025-01-10', 10, 15.0000::numeric, 550000::numeric, 'cancelado', 'Préstamo cancelado sin mora')
) as seed(cedula, monto_concedido, fecha_otorgamiento, cantidad_cuotas, tasa_interes, cuota_mensual, estado, observacion)
join public.socios s on s.cedula = seed.cedula
where not exists (
  select 1
  from public.prestamos p
  where p.socio_id = s.id
    and p.monto_concedido = seed.monto_concedido
    and p.fecha_otorgamiento = seed.fecha_otorgamiento::date
);

-- =============================================================
-- 7. Cuotas de prestamo
-- =============================================================

insert into public.cuotas_prestamo (
  prestamo_id,
  numero_cuota,
  monto,
  fecha_vencimiento,
  fecha_pago,
  estado
)
select p.id, seed.numero_cuota, seed.monto, seed.fecha_vencimiento::date, seed.fecha_pago::date, seed.estado
from (
  values
    -- Juan Pérez: cuotas pagadas, una vencida y pendientes.
    ('1234567', 10000000::numeric, '2025-11-15', 1, 650000::numeric, '2025-12-10', '2025-12-09', 'pagada'),
    ('1234567', 10000000::numeric, '2025-11-15', 2, 650000::numeric, '2026-01-10', '2026-01-10', 'pagada'),
    ('1234567', 10000000::numeric, '2025-11-15', 3, 650000::numeric, '2026-02-10', '2026-02-08', 'pagada'),
    ('1234567', 10000000::numeric, '2025-11-15', 4, 650000::numeric, '2026-03-10', '2026-03-10', 'pagada'),
    ('1234567', 10000000::numeric, '2025-11-15', 5, 650000::numeric, '2026-04-10', '2026-04-11', 'pagada'),
    ('1234567', 10000000::numeric, '2025-11-15', 6, 650000::numeric, '2026-05-10', null, 'vencida'),
    ('1234567', 10000000::numeric, '2025-11-15', 7, 650000::numeric, '2026-07-10', null, 'pendiente'),
    ('1234567', 10000000::numeric, '2025-11-15', 8, 650000::numeric, '2026-08-10', null, 'pendiente'),
    -- María González: préstamo cancelado con cuotas pagadas.
    ('2345678', 5000000::numeric, '2025-01-10', 1, 550000::numeric, '2025-02-10', '2025-02-07', 'pagada'),
    ('2345678', 5000000::numeric, '2025-01-10', 2, 550000::numeric, '2025-03-10', '2025-03-08', 'pagada'),
    ('2345678', 5000000::numeric, '2025-01-10', 3, 550000::numeric, '2025-04-10', '2025-04-09', 'pagada')
) as seed(cedula, monto_concedido, fecha_otorgamiento, numero_cuota, monto, fecha_vencimiento, fecha_pago, estado)
join public.socios s on s.cedula = seed.cedula
join public.prestamos p
  on p.socio_id = s.id
 and p.monto_concedido = seed.monto_concedido
 and p.fecha_otorgamiento = seed.fecha_otorgamiento::date
on conflict (prestamo_id, numero_cuota) do update
set
  monto = excluded.monto,
  fecha_vencimiento = excluded.fecha_vencimiento,
  fecha_pago = excluded.fecha_pago,
  estado = excluded.estado;

-- =============================================================
-- 8. Pagos
-- =============================================================

insert into public.pagos (
  socio_id,
  aporte_id,
  cuota_prestamo_id,
  concepto,
  tipo_pago,
  monto,
  estado,
  fecha_vencimiento,
  fecha_pago,
  metodo_pago,
  referencia_externa,
  observacion
)
select
  s.id,
  a.id,
  null::uuid,
  seed.concepto,
  'aporte',
  seed.monto,
  seed.estado,
  seed.fecha_vencimiento::date,
  seed.fecha_pago::date,
  seed.metodo_pago,
  seed.referencia_externa,
  seed.observacion
from (
  values
    ('1234567', '2026-04', 'Pago aporte abril 2026', 100000::numeric, 'pagado', '2026-04-10', '2026-04-09', 'transferencia', 'TRX-AP-001', 'Pago confirmado'),
    ('2345678', '2026-07', 'Pago aporte julio 2026', 100000::numeric, 'pagado', '2026-07-10', '2026-07-05', 'efectivo', 'CAJA-AP-002', 'Pago en caja'),
    ('3456789', '2026-07', 'Pago aporte julio 2026', 100000::numeric, 'pagado', '2026-07-10', '2026-07-06', 'transferencia', 'TRX-AP-003', 'Pago confirmado')
) as seed(cedula, periodo, concepto, monto, estado, fecha_vencimiento, fecha_pago, metodo_pago, referencia_externa, observacion)
join public.socios s on s.cedula = seed.cedula
join public.aportes a on a.socio_id = s.id and a.periodo = seed.periodo
where not exists (
  select 1
  from public.pagos p
  where p.socio_id = s.id
    and p.aporte_id = a.id
    and p.tipo_pago = 'aporte'
    and p.referencia_externa = seed.referencia_externa
);

insert into public.pagos (
  socio_id,
  aporte_id,
  cuota_prestamo_id,
  concepto,
  tipo_pago,
  monto,
  estado,
  fecha_vencimiento,
  fecha_pago,
  metodo_pago,
  referencia_externa,
  observacion
)
select
  s.id,
  null::uuid,
  cp.id,
  seed.concepto,
  'cuota_prestamo',
  seed.monto,
  seed.estado,
  seed.fecha_vencimiento::date,
  seed.fecha_pago::date,
  seed.metodo_pago,
  seed.referencia_externa,
  seed.observacion
from (
  values
    ('1234567', 10000000::numeric, '2025-11-15', 1, 'Pago cuota 1 préstamo Juan', 650000::numeric, 'pagado', '2025-12-10', '2025-12-09', 'transferencia', 'TRX-PR-001', 'Cuota pagada'),
    ('1234567', 10000000::numeric, '2025-11-15', 6, 'Cuota vencida préstamo Juan', 650000::numeric, 'vencido', '2026-05-10', null, 'otro', 'PEND-PR-006', 'Cuota vencida pendiente'),
    ('2345678', 5000000::numeric, '2025-01-10', 1, 'Pago cuota 1 préstamo María', 550000::numeric, 'pagado', '2025-02-10', '2025-02-07', 'efectivo', 'CAJA-PR-002', 'Cuota pagada')
) as seed(cedula, monto_concedido, fecha_otorgamiento, numero_cuota, concepto, monto, estado, fecha_vencimiento, fecha_pago, metodo_pago, referencia_externa, observacion)
join public.socios s on s.cedula = seed.cedula
join public.prestamos pr
  on pr.socio_id = s.id
 and pr.monto_concedido = seed.monto_concedido
 and pr.fecha_otorgamiento = seed.fecha_otorgamiento::date
join public.cuotas_prestamo cp
  on cp.prestamo_id = pr.id
 and cp.numero_cuota = seed.numero_cuota
where not exists (
  select 1
  from public.pagos p
  where p.socio_id = s.id
    and p.cuota_prestamo_id = cp.id
    and p.tipo_pago = 'cuota_prestamo'
    and p.referencia_externa = seed.referencia_externa
);

-- =============================================================
-- 9. Notificaciones
-- =============================================================

insert into public.notificaciones (
  socio_id,
  destinatario_tipo,
  tipo,
  titulo,
  mensaje,
  canal,
  prioridad,
  leida
)
select s.id, seed.destinatario_tipo, seed.tipo, seed.titulo, seed.mensaje, seed.canal, seed.prioridad, seed.leida
from (
  values
    ('1234567', 'socio', 'danger', 'Deuda pendiente', 'Tenés aportes y una cuota de préstamo vencida. Regularizá tu situación.', 'app', 'alta', false),
    ('2345678', 'socio', 'success', 'Aporte al día', 'Tus aportes se encuentran al día. ¡Gracias por tu compromiso!', 'app', 'normal', false),
    ('3456789', 'socio', 'info', 'Aviso general', 'Recordá mantener tus datos de contacto actualizados.', 'app', 'normal', false)
) as seed(cedula, destinatario_tipo, tipo, titulo, mensaje, canal, prioridad, leida)
join public.socios s on s.cedula = seed.cedula
where not exists (
  select 1
  from public.notificaciones n
  where n.socio_id = s.id
    and n.titulo = seed.titulo
    and n.mensaje = seed.mensaje
);

insert into public.notificaciones (
  socio_id,
  destinatario_tipo,
  tipo,
  titulo,
  mensaje,
  canal,
  prioridad,
  leida
)
select null, 'todos', 'info', 'Bienvenida al portal', 'El Portal del Socio ya cuenta con datos de prueba para validar Supabase.', 'app', 'normal', false
where not exists (
  select 1
  from public.notificaciones n
  where n.socio_id is null
    and n.destinatario_tipo = 'todos'
    and n.titulo = 'Bienvenida al portal'
);

commit;
