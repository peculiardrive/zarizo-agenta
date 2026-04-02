const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SEED_PRODUCTS = [
  {
    title: 'Aura Bloom Anti-Aging Serum',
    price: 12500,
    commission_type: 'percent',
    commission_value: 15,
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: 'A premium organic serum for radiant skin. Infused with botanical extracts and essential oils to reduce fine lines and boost hydration.',
    status: 'active',
    category: 'Beauty'
  },
  {
    title: 'SmartHome Pro Hub V2',
    price: 45000,
    commission_type: 'fixed',
    commission_value: 5000,
    image_url: 'https://images.unsplash.com/photo-1558002038-103792e07a70?auto=format&fit=crop&q=80&w=800',
    description: 'The ultimate home automation controller. Compatible with over 1,000 devices. Secure, fast, and easy to set up.',
    status: 'active',
    category: 'Electronics'
  },
  {
    title: 'Zarizo Digital Growth Kit',
    price: 7500,
    commission_type: 'percent',
    commission_value: 20,
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    description: 'Master the art of digital marketing. Includes 5 e-books, 10 templates, and access to our private Discord community.',
    status: 'active',
    category: 'Education'
  },
  {
    title: 'Heritage Leather Weekender',
    price: 32000,
    commission_type: 'percent',
    commission_value: 10,
    image_url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800',
    description: 'A timeless travel companion handcrafted from genuine top-grain leather. Built to last a lifetime of adventures.',
    status: 'active',
    category: 'Fashion'
  }
];

async function seed() {
  console.log('🚀 Starting Zarizo Marketplace Seeding...');

  // 1. Get a business ID to associate products with (or create a dummy one)
  const { data: biz } = await supabase.from('businesses').select('id').limit(1).single();
  
  if (!biz) {
    console.warn('⚠️ No operational business found. Creating a Seed Brand account...');
    // In a real scenario we might want to create a user first, but for seeding 
    // we'll assume the first business in the DB or instruct the user.
    return;
  }

  const productsToInsert = SEED_PRODUCTS.map(p => ({
    ...p,
    business_id: biz.id
  }));

  const { error } = await supabase.from('products').insert(productsToInsert);

  if (error) {
    console.error('❌ Seeding failed:', error.message);
  } else {
    console.log('✅ Marketplace successfully populated with realistic startup data!');
  }
}

seed();
