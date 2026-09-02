import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProfile, seedSocialDataIfEmpty } from './db';
import type { UserProfile } from './types';
import Layout from './components/Layout';
import Welcome from './pages/onboarding/Welcome';
import GoalSelection from './pages/onboarding/GoalSelection';
import Availability from './pages/onboarding/Availability';
import BaselineIntro from './pages/onboarding/BaselineIntro';
import BaselineTest from './pages/onboarding/BaselineTest';
import PlanSummary from './pages/onboarding/PlanSummary';
import Today from './pages/Today';
import RepCounter from './pages/RepCounter';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Friends from './pages/social/Friends';
import Leaderboard from './pages/social/Leaderboard';
import Challenges from './pages/social/Challenges';
import AddFriends from './pages/social/AddFriends';
import NudgeFriend from './pages/social/NudgeFriend';
import Notifications from './pages/social/Notifications';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);

  useEffect(() => {
    getProfile().then(p => setProfile(p ?? null));
    seedSocialDataIfEmpty();
  }, []);

  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center h-full bg-bg-primary">
        <div className="w-8 h-8 border-2 border-purple-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const needsOnboarding = !profile || !profile.onboardingComplete;
  const needsBaseline = profile && profile.onboardingComplete && !profile.baselineComplete;

  return (
    <Routes>
      <Route path="/onboarding/welcome" element={<Welcome />} />
      <Route path="/onboarding/goals" element={<GoalSelection />} />
      <Route path="/onboarding/availability" element={<Availability />} />
      <Route path="/onboarding/baseline-intro" element={<BaselineIntro />} />
      <Route path="/onboarding/baseline-test" element={<BaselineTest />} />
      <Route path="/onboarding/plan-summary" element={<PlanSummary />} />
      <Route path="/counter/:exercise/:blockId" element={<RepCounter />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/friends/add" element={<AddFriends />} />
      <Route path="/friends/:id/nudge" element={<NudgeFriend />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route element={<Layout />}>
        <Route path="/today" element={<Today />} />
        <Route path="/plan" element={<Today />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route
        path="*"
        element={
          needsOnboarding ? <Navigate to="/onboarding/welcome" replace /> :
          needsBaseline ? <Navigate to="/onboarding/baseline-intro" replace /> :
          <Navigate to="/today" replace />
        }
      />
    </Routes>
  );
}
