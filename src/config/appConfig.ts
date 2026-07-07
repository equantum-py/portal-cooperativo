const modoDemoEnv = import.meta.env.VITE_MODO_DEMO;
const modoDemo = modoDemoEnv === undefined ? true : modoDemoEnv !== 'false';

export const appConfig = {
  // Modo de funcionamiento ('true' usa datos simulados, 'false' usa Supabase real)
  modoDemo,

  // Información de la Cooperativa
  nombreApp: "Portal Cooperativo",
  nombreInstitucion: "Portal Cooperativo",
  
  // Colores Base
  colores: {
    primario: "#0A2053",
    secundario: "#03AAE5",
    blanco: "#FFFFFF"
  },
  
  // Contacto y Soporte
  contacto: {
    whatsapp: "+595981000000",
    email: "soporte@portalcooperativo.com.py",
    telefonoCallCenter: "021 000 000"
  },

  // Configuración de delay para el modo demo
  simularRetardoAPI: 800 
};
