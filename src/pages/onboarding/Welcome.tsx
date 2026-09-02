import { useNavigate } from 'react-router-dom';
import personRunning from '../../components/images/person-running.png';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-bg-primary overflow-hidden">
      {/* Hero photo */}
      <div
        className="absolute left-0 right-0 top-[24%] h-[48%] overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(180deg, transparent 0%, black 18%, black 78%, transparent 100%)',
          maskImage: 'linear-gradient(180deg, transparent 0%, black 18%, black 78%, transparent 100%)',
        }}
      >
        <img
          src={personRunning}
          alt=""
          className="absolute left-1/2 top-1/2 w-[135%] max-w-none -translate-x-[38%] -translate-y-1/2"
        />
      </div>

      {/* Scrim so text/buttons stay legible over the photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(15,10,26,0.55) 0%, rgba(15,10,26,0.15) 18%, rgba(15,10,26,0.15) 55%, rgba(15,10,26,0.85) 78%, #0F0A1A 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 15% 8%, rgba(124,58,237,0.35), transparent 55%)' }}
      />

      {/* Content */}
      <div className="relative flex flex-col justify-between min-h-screen px-6 py-12 animate-fade-in">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">
            CENTURY<span className="text-purple-accent">FIT</span>
          </h1>
          <p className="text-text-secondary max-w-xs leading-relaxed">
            100 Push-ups. 100 Pull-ups. 100 Squats.<br />
            Every day. Any level.<br />
            Stronger every day.
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={() => navigate('/onboarding/goals')}
            className="w-full py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg shadow-lg shadow-purple-accent/25"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/onboarding/goals')}
            className="w-full py-3 text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
