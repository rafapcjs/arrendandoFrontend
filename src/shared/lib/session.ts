const ADMIN = 'ADMIN';
const INMOBILIARIA = 'INMOBILIARIA';

export const getUserRole = (): string =>
  sessionStorage.getItem('user_role') ?? '';

export const getInmobiliariaId = (): string | null => {
  const id = sessionStorage.getItem('inmobiliaria_id');
  return id === '' || id === null ? null : id;
};

export const isAdmin = (): boolean =>
  getUserRole() === ADMIN;

export const isInmobiliaria = (): boolean =>
  getUserRole() === INMOBILIARIA;
