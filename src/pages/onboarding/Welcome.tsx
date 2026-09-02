import { useNavigate } from 'react-router-dom';
import CenturyFitLogo from '../../components/CenturyFitLogo';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-between min-h-full px-6 py-12 bg-bg-primary">
      <div />
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <CenturyFitLogo size={120} />
        <h1 className="text-4xl font-bold tracking-tight text-center">
          CENTURY<span className="text-purple-accent">FIT</span>
        </h1>
        <p className="text-text-secondary text-center max-w-xs leading-relaxed">
          100 Push-ups. 100 Pull-ups. 100 Squats.<br />
          Every day. Any level.<br />
          Stronger every day.
        </p>
      </div>
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={() => navigate('/onboarding/goals')}
          className="w-full py-4 bg-purple-accent hover:bg-purple-dark text-white font-semibold rounded-2xl transition-colors text-lg"
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
  );
}
