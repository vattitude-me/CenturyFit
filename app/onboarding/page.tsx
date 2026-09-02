'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type BaselineStep = 'welcome' | 'pushups' | 'pullups' | 'squats' | 'preferences' | 'complete'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<BaselineStep>('welcome')
  const [pushupMax, setPushupMax] = useState<number>(0)
  const [pullupMax, setPullupMax] = useState<number>(0)
  const [squatMax, setSquatMax] = useState<number>(0)
  const [wakeTime, setWakeTime] = useState<string>('07:00')
  const [sleepTime, setSleepTime] = useState<string>('22:00')
  const [injuryFlags, setInjuryFlags] = useState<string[]>([])
  const [equipment, setEquipment] = useState<string[]>([])
  const [daysAvailable, setDaysAvailable] = useState<number[]>([1, 2, 3, 4, 5])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmitBaseline = async () => {
    if (!pushupMax || !pullupMax || !squatMax) {
      setError('Please enter values for all exercises')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call API endpoint to save baseline
      const res = await fetch('/api/onboarding/baseline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pushup_max: pushupMax,
          pullup_max: pullupMax,
          squat_max: squatMax,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to save baseline')
      }

      setStep('complete')
    } catch (err) {
      console.error('Baseline submission error:', err)
      setError('Failed to save baseline. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipPreferences = () => {
    setStep('complete')
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary">Welcome to CenturyFit</h1>
            <p className="text-muted-foreground">
              Let's get you started on your journey to 100 push-ups, pull-ups, and squats every day.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">What is CenturyFit?</h2>
              <p className="text-muted-foreground">
                CenturyFit coaches you from wherever you are today to completing 100 push-ups,
                100 pull-ups, and 100 squats every single day - split intelligently across your
                waking hours with a built-in rep counter and social accountability.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">How it works</h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm">
                <li>We test your current max reps for each exercise</li>
                <li>We create a personalized daily plan that ramps you up to 100/day</li>
                <li>We split your daily target into mini-sets across the day</li>
                <li>You complete sets when reminded, with audio guidance and tracking</li>
                <li>We adjust your plan based on your progress and recovery</li>
                <li>Friends can cheer you on and send nudges when you fall behind</li>
              </ol>
            </div>

            <button
              onClick={() => setStep('pushups')}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              Let's Get Started
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'pushups') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Push-up Test</h1>
            <p className="text-muted-foreground">
              How many push-ups can you do with good form in one set?
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <div className="text-6xl font-bold text-primary mb-4">
              {pushupMax}
            </div>
            <p className="text-muted-foreground">reps</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setPushupMax(Math.max(0, pushupMax - 1))}
              className="flex-1 py-3 px-4 bg-input text-foreground border border-border rounded-lg"
            >
              -
            </button>
            <button
              onClick={() => setPushupMax(pushupMax + 1)}
              className="flex-1 py-3 px-4 bg-accent text-accent-foreground border-none rounded-lg font-semibold"
            >
              +
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            If you can't do standard push-ups yet, you'll start with knee or incline variations.
          </p>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep('welcome')}
              className="py-3 px-4 bg-input text-foreground border border-border rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep('pullups')}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'pullups') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Pull-up Test</h1>
            <p className="text-muted-foreground">
              How many pull-ups can you do with good form in one set?
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <div className="text-6xl font-bold text-primary mb-4">
              {pullupMax}
            </div>
            <p className="text-muted-foreground">reps</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setPullupMax(Math.max(0, pullupMax - 1))}
              className="flex-1 py-3 px-4 bg-input text-foreground border border-border rounded-lg"
            >
              -
            </button>
            <button
              onClick={() => setPullupMax(pullupMax + 1)}
              className="flex-1 py-3 px-4 bg-accent text-accent-foreground border-none rounded-lg font-semibold"
            >
              +
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            If you can't do pull-ups yet, we'll start with assisted variations or Australian rows.
          </p>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep('pushups')}
              className="py-3 px-4 bg-input text-foreground border border-border rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep('squats')}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'squats') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Squat Test</h1>
            <p className="text-muted-foreground">
              How many squats can you do with good form in one set?
            </p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <div className="text-6xl font-bold text-primary mb-4">
              {squatMax}
            </div>
            <p className="text-muted-foreground">reps</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setSquatMax(Math.max(0, squatMax - 1))}
              className="flex-1 py-3 px-4 bg-input text-foreground border border-border rounded-lg"
            >
              -
            </button>
            <button
              onClick={() => setSquatMax(squatMax + 1)}
              className="flex-1 py-3 px-4 bg-accent text-accent-foreground border-none rounded-lg font-semibold"
            >
              +
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            If standard squats are challenging, we'll start with box or chair-assisted variations.
          </p>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep('pullups')}
              className="py-3 px-4 bg-input text-foreground border border-border rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep('preferences')}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'preferences') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Your Preferences</h1>
            <p className="text-muted-foreground">
              Help us customize your experience (optional)
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium mb-1">Wake-up time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full py-2 px-3 bg-input border border-border rounded-lg text-foreground"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium mb-1">Bedtime</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full py-2 px-3 bg-input border border-border rounded-lg text-foreground"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium mb-1">
                Injuries or limitations (select all that apply)
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={injuryFlags.includes('shoulder')}
                    onChange={(e) => {
                      if (e.target.checked) setInjuryFlags([...injuryFlags, 'shoulder'])
                      else setInjuryFlags(injuryFlags.filter((f) => f !== 'shoulder'))
                    }}
                    className="h-4 w-4 text-primary"
                  />
                  Shoulder
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={injuryFlags.includes('knee')}
                    onChange={(e) => {
                      if (e.target.checked) setInjuryFlags([...injuryFlags, 'knee'])
                      else setInjuryFlags(injuryFlags.filter((f) => f !== 'knee'))
                    }}
                    className="h-4 w-4 text-primary"
                  />
                  Knee
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={injuryFlags.includes('wrist')}
                    onChange={(e) => {
                      if (e.target.checked) setInjuryFlags([...injuryFlags, 'wrist'])
                      else setInjuryFlags(injuryFlags.filter((f) => f !== 'wrist'))
                    }}
                    className="h-4 w-4 text-primary"
                  />
                  Wrist
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={injuryFlags.includes('back')}
                    onChange={(e) => {
                      if (e.target.checked) setInjuryFlags([...injuryFlags, 'back'])
                      else setInjuryFlags(injuryFlags.filter((f) => f !== 'back'))
                    }}
                    className="h-4 w-4 text-primary"
                  />
                  Back
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium mb-1">
                Available equipment (select all that apply)
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={equipment.includes('pullup-bar')}
                    onChange={(e) => {
                      if (e.target.checked) setEquipment([...equipment, 'pullup-bar'])
                      else setEquipment(equipment.filter((f) => f !== 'pullup-bar'))
                    }}
                    className="h-4 w-4 text-primary"
                  />
                  Pull-up bar
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={equipment.includes('resistance-band')}
                    onChange={(e) => {
                      if (e.target.checked) setEquipment([...equipment, 'resistance-band'])
                      else setEquipment(equipment.filter((f) => f !== 'resistance-band'))
                    }}
                    className="h-4 w-4 text-primary"
                  />
                  Resistance band
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium mb-1">
                Days you want to workout (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                  const isSelected = daysAvailable.includes(day)
                  return (
                    <label
                      key={day}
                      className={`flex items-center space-x-1 py-1 px-3 rounded ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-input text-foreground border border-border'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked)
                            setDaysAvailable([...daysAvailable, day])
                          else setDaysAvailable(daysAvailable.filter((d) => d !== day))
                        }}
                        className="h-4 w-4"
                      />
                      <span>{dayNames[day]}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </form>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep('squats')}
              className="py-3 px-4 bg-input text-foreground border border-border rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleSubmitBaseline}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              {isLoading ? 'Saving...' : 'Finish & Generate Plan'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="text-6xl font-bold text-primary mb-4">
            🎉
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Baseline Complete!</h1>
          <p className="text-muted-foreground mb-6">
            Your personalized plan has been generated based on:
          </p>

          <div className="text-left max-w mx-auto mb-6">
            <p className="flex items-center space-x-2 text-sm">
              <span className="block w-8">•</span>
              <span>
                Push-ups: {pushupMax} max → starting with{' '}
                {pushupMax < 5 ? 'knee/incline' : 'standard'} push-ups
              </span>
            </p>
            <p className="flex items-center space-x-2 text-sm">
              <span className="block w-8">•</span>
              <span>
                Pull-ups: {pullupMax} max → starting with{' '}
                {pullupMax === 0 ? 'assisted/negatives' : 'standard'} pull-ups
              </span>
            </p>
            <p className="flex items-center space-x-2 text-sm">
              <span className="block w-8">•</span>
              <span>
                Squats: {squatMax} max → starting with{' '}
                {squatMax < 8 ? 'box/chair-assisted' : 'standard'} squats
              </span>
            </p>
          </div>

          <p className="text-muted-foreground mb-8">
            Your first day's plan will be visible on your dashboard. Get ready to start
            tomorrow!
          </p>

          <button
            onClick={() => {
              router.push('/dashboard')
            }}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return null
}