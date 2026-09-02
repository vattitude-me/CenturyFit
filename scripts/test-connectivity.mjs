import { createClient } from '@supabase/supabase-js'

async function testSupabase() {
  console.log('--- Testing Supabase Connection ---')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !anonKey || !serviceKey) {
    console.error('❌ Missing Supabase environment variables')
    return false
  }

  try {
    // 1. Test Anon Client
    const supabaseAnon = createClient(supabaseUrl, anonKey)
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('profiles')
      .select('count')
      .limit(1)

    if (anonError && anonError.code !== 'PGRST116') {
      console.log('⚠️ Anon client returned error (might be expected due to RLS):', anonError.message)
    } else {
      console.log('✅ Supabase Anon Client: Connected successfully')
    }

    // 2. Test Service Role Client (admin access)
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1)

    if (adminError) {
      console.error('❌ Supabase Admin Client Error:', adminError.message)
      return false
    } else {
      console.log('✅ Supabase Admin Client: Connected successfully')
    }

    // 3. Test required tables existence
    const tables = ['profiles', 'baselines', 'daily_plans', 'planned_sets', 'completed_sets', 'streaks', 'friendships', 'cheers', 'push_subscriptions', 'notification_prefs']
    console.log('\nChecking tables in database:')
    for (const table of tables) {
      const { error } = await supabaseAdmin.from(table).select('count').limit(1)
      if (error) {
        console.log(`  ❌ Table '${table}': ${error.message}`)
      } else {
        console.log(`  ✅ Table '${table}': exists`)
      }
    }

    return true
  } catch (err) {
    console.error('❌ Supabase connection error:', err)
    return false
  }
}

async function testClerk() {
  console.log('\n--- Testing Clerk Configuration ---')
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY

  if (!publishableKey || !secretKey) {
    console.error('❌ Missing Clerk environment variables')
    return false
  }

  console.log('✅ Publishable Key format:', publishableKey.startsWith('pk_') ? 'Valid' : 'Invalid')
  console.log('✅ Secret Key format:', secretKey.startsWith('sk_') ? 'Valid' : 'Invalid')

  // Test Clerk API directly
  try {
    const res = await fetch('https://api.clerk.com/v1/users?limit=1', {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      console.log('✅ Clerk API: Successfully connected with secret key')
      return true
    } else {
      const errorText = await res.text()
      console.error('❌ Clerk API Error:', res.status, errorText)
      return false
    }
  } catch (err) {
    console.error('❌ Clerk API Connection Error:', err)
    return false
  }
}

async function run() {
  console.log('====================================')
  console.log('CenturyFit Production Connectivity Test')
  console.log('====================================\n')

  const supabaseOk = await testSupabase()
  const clerkOk = await testClerk()

  console.log('\n====================================')
  if (supabaseOk && clerkOk) {
    console.log('🎉 ALL PRODUCTION SERVICES CONNECTED SUCCESSFULLY!')
  } else {
    console.log('⚠️ Some checks had issues. Please check the logs above.')
  }
  console.log('====================================')
}

run()
