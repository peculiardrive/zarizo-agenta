import { Database } from './supabase/types';
import { createClient } from './supabase/server';

export type UserRole = Database['public']['Tables']['users']['Row']['role'] | 'customer' | 'reseller';

export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getUserRole(): Promise<UserRole | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    console.error('Error fetching user role:', error);
    return null;
  }

  return (data as any).role as UserRole;
}

export async function getFullUser() {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function requireAuth(allowedRoles?: UserRole[]) {
  const role = await getUserRole();
  
  if (!role) {
    return { authorized: false, redirect: '/auth/login' };
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return { authorized: false, redirect: '/unauthorized' }; // or their dashboard
  }

  return { authorized: true, role };
}
