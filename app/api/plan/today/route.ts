import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { getWeekNumber, generatePlansFromBaseline } from '@/lib/plan/generator'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const supabase = await createServerClient()

    // Get active baseline
    const { data: baselineData, error: baselineError } = await supabase
      .from('baselines')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (baselineError || !baselineData) {
      return new Response(JSON.stringify({ error: 'No active baseline found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    const baseline = {
      pushup_max: baselineData.pushup_max,
      pullup_max: baselineData.pullup_max,
      squat_max: baselineData.squat_max,
      assessed_at: baselineData.assessed_at || baselineData.created_at,
    }

    const weekNumber = getWeekNumber(baseline.assessed_at)
    const result = generatePlansFromBaseline(baseline, weekNumber)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Error fetching plan:', err)
    return new Response('Internal server error', { status: 500 })
  }
}
