export enum Role {
  ADMIN = 'ADMIN',
  INMOBILIARIA = 'INMOBILIARIA',
}

export const getUserRole = (): string =>
  sessionStorage.getItem('user_role') ?? '';

export const getInmobiliariaId = (): string | null => {
  const id = sessionStorage.getItem('inmobiliaria_id');
  return id === '' || id === null ? null : id;
};

export const isAdmin = (): boolean =>
  getUserRole() === Role.ADMIN;

export const isInmobiliaria = (): boolean =>
  getUserRole() === Role.INMOBILIARIA;
