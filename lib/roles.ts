export type UserRole = 'admin' | 'business_owner' | 'agent' | 'customer' | 'reseller';

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  business_owner: '/business/dashboard',
  agent: '/agent/dashboard',
  customer: '/customer/dashboard',
  reseller: '/reseller/dashboard',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'],
  business_owner: ['business_owner', 'agent'], 
  agent: ['agent'],
  customer: ['customer'],
  reseller: ['reseller'],
};

export function getDashboardForRole(role: UserRole | string): string {
  const r = role === 'business' ? 'business_owner' : role as UserRole;
  return ROLE_DASHBOARDS[r] || '/auth/login';
}

export function isAuthorized(role: UserRole, targetRoute: string): boolean {
  const currentRole = role as string;
  if (currentRole === 'admin') return true;
  
  if (targetRoute.startsWith('/admin') && currentRole !== 'admin') return false;
  if (targetRoute.startsWith('/business') && currentRole !== 'business_owner') return false;
  if (targetRoute.startsWith('/agent') && currentRole !== 'agent') return false;
  if (targetRoute.startsWith('/customer') && currentRole !== 'customer') return false;
  if (targetRoute.startsWith('/reseller') && currentRole !== 'reseller') return false;
  
  return true;
}
