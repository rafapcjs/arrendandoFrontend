export interface DashboardStats {
  totalUsuarios: number;
  usuariosActivos: number;
  totalInquilinos: number;
  inquilinosActivos: number;
  totalInmuebles: number;
  inmueblesDisponibles: number;
  inmueblesOcupados: number;
  totalContratos: number;
  contratosActivos: number;
  contratosProximosVencer: number;
  contratosVencidos: number;
  tasaOcupacion: number;
}

export interface AdminDashboardStats {
  usuarios: {
    total: number;
    activos: number;
    inactivos: number;
    rolesAdmin: number;
    rolesInmobiliaria: number;
  };
  inmobiliarias: {
    total: number;
    activas: number;
    inactivas: number;
  };
  plataforma: {
    totalInmuebles: number;
    totalInquilinos: number;
    totalContratos: number;
    contratosActivos: number;
    contratosProximosVencer: number;
    contratosVencidos: number;
    totalPagos: number;
    pagosPendientes: number;
    pagosVencidos: number;
    montoRecaudadoMesActual: number;
    montoPendienteRecaudar: number;
  };
  topInmobiliarias: {
    id: string;
    nombre: string;
    totalContratos: number;
    montoRecaudado: number;
  }[];
}