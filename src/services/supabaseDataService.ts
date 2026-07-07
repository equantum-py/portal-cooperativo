import { requireSupabase } from '../lib/supabaseClient';

type SupabaseRow = Record<string, unknown>;

const fetchMany = async (table: string, query = '*'): Promise<SupabaseRow[]> => {
  const client = requireSupabase();
  const { data, error } = await client.from(table).select(query);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SupabaseRow[];
};

export const supabaseDataService = {
  async getConfiguracionGeneral(): Promise<SupabaseRow | null> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('configuracion_general')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  async getSocios(): Promise<SupabaseRow[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('socios')
      .select('*')
      .order('numero_socio', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getSocioByCedula(cedula: string): Promise<SupabaseRow | null> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('socios')
      .select('*')
      .eq('cedula', cedula)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAportesBySocio(socioId: string): Promise<SupabaseRow[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('aportes')
      .select('*')
      .eq('socio_id', socioId)
      .order('periodo', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getPrestamosBySocio(socioId: string): Promise<SupabaseRow[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('prestamos')
      .select('*, cuotas_prestamo(*)')
      .eq('socio_id', socioId)
      .order('fecha_otorgamiento', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getPagosBySocio(socioId: string): Promise<SupabaseRow[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('pagos')
      .select('*')
      .eq('socio_id', socioId)
      .order('fecha_vencimiento', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getCuentasAhorroBySocio(socioId: string): Promise<SupabaseRow[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('cuentas_ahorro')
      .select('*, movimientos_ahorro(*)')
      .eq('socio_id', socioId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getMovimientosAhorroByCuenta(cuentaAhorroId: string): Promise<SupabaseRow[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('movimientos_ahorro')
      .select('*')
      .eq('cuenta_ahorro_id', cuentaAhorroId)
      .order('fecha', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getNotificacionesBySocio(socioId: string): Promise<SupabaseRow[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('notificaciones')
      .select('*')
      .or(`socio_id.eq.${socioId},socio_id.is.null`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getAllAportes(): Promise<SupabaseRow[]> {
    return fetchMany('aportes', '*, socios(nombre_completo, cedula, numero_socio)');
  },

  async getAllPrestamos(): Promise<SupabaseRow[]> {
    return fetchMany('prestamos', '*, socios(nombre_completo, cedula, numero_socio), cuotas_prestamo(*)');
  },

  async getAllPagos(): Promise<SupabaseRow[]> {
    return fetchMany('pagos', '*, socios(nombre_completo, cedula, numero_socio)');
  },
};
