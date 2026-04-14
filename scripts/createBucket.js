require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('image', { public: true });
  if (error) {
    console.error('Error creating bucket:', error);
  } else {
    console.log('Bucket created successfully', data);
  }
}

createBucket();
