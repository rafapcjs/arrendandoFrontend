// Shared constants
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  PROPERTIES: '/properties',
  TENANTS: '/tenants',
  CONTRACTS: '/contratos',
  REPORTS: '/reports',
  PAYMENTS: '/pagos',
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  TENANTS: '/tenants',
  PROPERTIES: '/properties',
  CONTRACTS: '/contracts',
  REPORTS: '/reports',
  PAYMENTS: '/payments',
  NOT_FOUND: '/404',
} as const;

export const QUERY_KEYS = {
  AUTH: ['auth'],
  USERS: ['users'],
  PROPERTIES: ['properties'],
  TENANTS: ['tenants'],
  CONTRACTS: ['contracts'],
  REPORTS: ['reports'],
  PAYMENTS: ['payments'],
} as const;