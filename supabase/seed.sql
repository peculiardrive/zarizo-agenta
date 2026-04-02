-- Extensive Seed Data for Zarizo

-- 1. Example Businesses
INSERT INTO public.businesses (business_name, owner_name, email, phone, description, status)
VALUES 
  ('Aura Cosmetics', 'Zainab Bello', 'hello@auracosmetics.com', '+234 812 345 6789', 'Premium organic skincare for African skin.', 'active'),
  ('Zuri Hair', 'Amina Mohammed', 'sales@zurihair.co', '+234 803 111 2222', 'Luxury human hair and braiding accessories.', 'active');

-- 2. Example Agents
INSERT INTO public.agents (referral_code, bank_name, account_number, account_name, status)
VALUES 
  ('AF831', 'GTBank', '0123456789', 'Afolabi Gbolahan', 'active'),
  ('CH120', 'Zenith Bank', '0987654321', 'Chioma Ngige', 'active'),
  ('MU442', 'UBA', '1122334455', 'Musa Bello', 'active');

-- 3. Products for Aura Cosmetics
INSERT INTO public.products (business_id, title, description, price, category, commission_type, commission_value, status)
VALUES 
  ((SELECT id FROM public.businesses WHERE business_name = 'Aura Cosmetics'), 'Glow Serum', 'Vitamin C based serum for radiant skin.', 15000, 'Beauty & Skincare', 'percent', 15, 'active'),
  ((SELECT id FROM public.businesses WHERE business_name = 'Aura Cosmetics'), 'Shea Souffle', 'Whipped shea butter for intense hydration.', 8500, 'Beauty & Skincare', 'fixed', 1500, 'active');

-- 4. Products for Zuri Hair
INSERT INTO public.products (business_id, title, description, price, category, commission_type, commission_value, status)
VALUES 
  ((SELECT id FROM public.businesses WHERE business_name = 'Zuri Hair'), 'Bone Straight Wig', 'Premium 14 inch bone straight human hair wig.', 120000, 'Haircare', 'percent', 10, 'active'),
  ((SELECT id FROM public.businesses WHERE business_name = 'Zuri Hair'), 'Braid Sealant', 'Keeps your braids neat and shiny for weeks.', 4500, 'Haircare', 'fixed', 500, 'active');

-- 5. Orders & Commissions
INSERT INTO public.orders (id, product_id, business_id, agent_id, customer_name, customer_phone, customer_address, quantity, total_amount, commission_amount, order_status, payment_status)
VALUES 
  ('ORD-000001', (SELECT id FROM public.products WHERE title = 'Glow Serum'), (SELECT id FROM public.businesses WHERE business_name = 'Aura Cosmetics'), (SELECT id FROM public.agents WHERE referral_code = 'AF831'), 'Tunde Johnson', '07011122233', '12 Awolowo Road, Ikoyi, Lagos', 1, 15000, 2250, 'delivered', 'paid'),
  ('ORD-000002', (SELECT id FROM public.products WHERE title = 'Bone Straight Wig'), (SELECT id FROM public.businesses WHERE business_name = 'Zuri Hair'), (SELECT id FROM public.agents WHERE referral_code = 'CH120'), 'Sarah Ibrahim', '08044455566', '55 Adetokunbo Ademola, Abuja', 1, 120000, 12000, 'delivered', 'paid');

INSERT INTO public.commissions (order_id, agent_id, amount, payout_status, paid_at)
VALUES 
  ('ORD-000001', (SELECT id FROM public.agents WHERE referral_code = 'AF831'), 2250, 'paid', NOW()),
  ('ORD-000002', (SELECT id FROM public.agents WHERE referral_code = 'CH120'), 12000, 'paid', NOW());
