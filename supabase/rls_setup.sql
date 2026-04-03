-- Update Users Role Type (if it's an enum, we need to add values)
-- Assuming it's a text column with a check constraint, or we can just update the check constraint.
-- If it's a custom type, use: ALTER TYPE user_role ADD VALUE 'customer';

-- 1. Enable RLS on all relevant tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. Helper function to check role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Users Table Policies
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.get_auth_role() = 'admin');

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 4. Businesses Table Policies
CREATE POLICY "Admins can manage all businesses" ON public.businesses
  FOR ALL USING (public.get_auth_role() = 'admin');

CREATE POLICY "Owners can manage their own business" ON public.businesses
  FOR ALL USING (user_id = auth.uid());

-- 5. Agents Table Policies
CREATE POLICY "Admins can manage all agents" ON public.agents
  FOR ALL USING (public.get_auth_role() = 'admin');

CREATE POLICY "Agents can manage their own record" ON public.agents
  FOR ALL USING (user_id = auth.uid());

-- 6. Products Table Policies
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can manage their own products" ON public.products
  FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (public.get_auth_role() = 'admin');

-- 7. Orders Table Policies
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.get_auth_role() = 'admin');

CREATE POLICY "Business owners can view their orders" ON public.orders
  FOR SELECT USING (
    business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Agents can view their referrals" ON public.orders
  FOR SELECT USING (
    agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  );

-- 8. Commissions Table Policies
CREATE POLICY "Admins can manage all commissions" ON public.commissions
  FOR ALL USING (public.get_auth_role() = 'admin');

CREATE POLICY "Agents can view their own commissions" ON public.commissions
  FOR SELECT USING (
    agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  );

-- 9. Payouts Table Policies
CREATE POLICY "Admins can manage all payouts" ON public.payouts
  FOR ALL USING (public.get_auth_role() = 'admin');

CREATE POLICY "Agents can view their own payouts" ON public.payouts
  FOR SELECT USING (
    agent_id IN (SELECT id FROM public.agents WHERE user_id = auth.uid())
  );

-- 10. Notifications Table Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());
