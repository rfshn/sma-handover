'use client';

import { useState, useEffect, useCallback } from 'react';
import { Settings } from 'lucide-react';
import { LandingScreen, CeremonyScreen, CelebrationScreen } from './components';
import { Participant, CeremonyStep, AppScreen, CEREMONY_STEPS, PARTICIPANT_ROLES } from './types';

// Local storage keys
const REDUCE_MOTION_KEY = 'sma-reduce-motion';
const USER_ROLE_KEY = 'sma_user_role';
const USER_NAME_KEY = 'sma_user_name';
const IS_ADMIN_KEY = 'sma_is_admin';

export default function Home() {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');

  // Participant state
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Ceremony state
  const [ceremonySteps, setCeremonySteps] = useState<CeremonyStep[]>(
    CEREMONY_STEPS.map((step) => ({
      ...step,
      completed: false,
    }))
  );
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminImpersonatingRole, setAdminImpersonatingRole] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [hostRole, setHostRole] = useState<string | null>(null);

  // UI state
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore user session from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem(USER_ROLE_KEY);
    const savedName = localStorage.getItem(USER_NAME_KEY);
    const savedIsAdmin = localStorage.getItem(IS_ADMIN_KEY) === 'true';
    const savedReduceMotion = localStorage.getItem(REDUCE_MOTION_KEY);

    if (savedRole && savedName) {
      setCurrentUserRole(savedRole);
      setCurrentUserName(savedName);
      setIsAdmin(savedIsAdmin);
    }

    if (savedReduceMotion !== null) {
      setReduceMotion(savedReduceMotion === 'true');
    } else {
      // Check system preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mediaQuery.matches);
    }
  }, []);

  // Save reduce motion preference
  const handleToggleReduceMotion = (enabled: boolean) => {
    setReduceMotion(enabled);
    localStorage.setItem(REDUCE_MOTION_KEY, String(enabled));
  };

  // Fetch participants from API
  const fetchParticipants = useCallback(async () => {
    try {
      const response = await fetch('/api/participants');
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      }
    } catch (err) {
      console.error('Error fetching participants:', err);
    }
  }, []);

  // Fetch ceremony progress from API
  const fetchCeremonyProgress = useCallback(async () => {
    try {
      const response = await fetch('/api/ceremony-progress');
      if (response.ok) {
        const data = await response.json();
        setCeremonySteps(data.steps);

        // Calculate current step
        const completedCount = data.steps.filter((s: CeremonyStep) => s.completed).length;
        setCurrentStep(Math.min(completedCount + 1, data.steps.length));

        // Auto-advance to celebration if ceremony is complete
        if (data.state.isComplete && currentScreen === 'ceremony') {
          setTimeout(() => {
            setCurrentScreen('celebration');
          }, 2000);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching ceremony progress:', err);
      setError('Failed to connect to ceremony. Please refresh the page.');
      setIsLoading(false);
    }
  }, [currentScreen]);

  // Initial load and polling
  useEffect(() => {
    fetchParticipants();
    fetchCeremonyProgress();

    const pollInterval = setInterval(() => {
      fetchParticipants();
      fetchCeremonyProgress();
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [fetchParticipants, fetchCeremonyProgress]);

  // Handle role join
  const handleJoinRole = async (role: string, accessCode: string) => {
    try {
      setError(null);
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      });

      if (response.ok) {
        const participant = await response.json();
        setCurrentUserRole(participant.role);
        setCurrentUserName(participant.name);

        // Check if user is admin
        if (participant.isAdmin) {
          setIsAdmin(true);
          localStorage.setItem(IS_ADMIN_KEY, 'true');
        }

        // Store in localStorage for persistence
        localStorage.setItem(USER_ROLE_KEY, participant.role);
        localStorage.setItem(USER_NAME_KEY, participant.name);

        await fetchParticipants();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to join ceremony');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to join ceremony');
    }
  };

  // Handle admin proceed anyway
  const handleAdminProceed = async (adminCode: string) => {
    try {
      setError(null);

      // First join as admin if not already
      if (!isAdmin) {
        const response = await fetch('/api/participants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: adminCode }),
        });

        if (response.ok) {
          const participant = await response.json();
          if (participant.isAdmin) {
            setCurrentUserRole('admin');
            setCurrentUserName('Administrator');
            setIsAdmin(true);
            localStorage.setItem(USER_ROLE_KEY, 'admin');
            localStorage.setItem(USER_NAME_KEY, 'Administrator');
            localStorage.setItem(IS_ADMIN_KEY, 'true');
            await fetchParticipants();
          }
        }
      }

      // Then start ceremony
      setCurrentScreen('ceremony');
    } catch (err: any) {
      setError(err.message || 'Failed to proceed with admin override');
    }
  };

  // Handle ceremony start
  const handleStartCeremony = () => {
    setCurrentScreen('ceremony');
  };

  // Handle step confirmation
  const handleConfirmStep = async (stepId: number) => {
    try {
      setError(null);
      // Check if user is admin or has host control
      const hasHostControl = isAdmin || (currentUserRole === hostRole && hostRole !== null);
      // If admin/host is impersonating, use that role
      const roleToUse = hasHostControl && adminImpersonatingRole ? adminImpersonatingRole : currentUserRole;

      // Find the code for the role
      let participantCode = '';
      if (roleToUse) {
        const roleEntry = Object.entries(PARTICIPANT_ROLES).find(
          ([, value]) => value.role === roleToUse
        );
        participantCode = roleEntry ? roleEntry[0] : '';
      }

      const response = await fetch('/api/ceremony-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId,
          participantCode,
        }),
      });

      if (response.ok) {
        await fetchCeremonyProgress();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to confirm step');
    }
  };

  // Handle back to home
  const handleBackToHome = async () => {
    try {
      // Reset ceremony on server
      await fetch('/api/reset', { method: 'POST' });

      // Reset local state
      setCurrentScreen('landing');
      setCurrentUserRole(null);
      setCurrentUserName(null);
      setIsAdmin(false);
      setAdminImpersonatingRole(null);
      setCeremonySteps(
        CEREMONY_STEPS.map((step) => ({
          ...step,
          completed: false,
        }))
      );
      setCurrentStep(1);

      // Clear localStorage
      localStorage.removeItem(USER_ROLE_KEY);
      localStorage.removeItem(USER_NAME_KEY);
      localStorage.removeItem(IS_ADMIN_KEY);

      await fetchParticipants();
      await fetchCeremonyProgress();
    } catch (err) {
      console.error('Error resetting ceremony:', err);
    }
  };

  // Handle logout (available for all users)
  const handleLogout = () => {
    setCurrentUserRole(null);
    setCurrentUserName(null);
    setIsAdmin(false);
    setIsHost(false);
    setHostRole(null);
    setAdminImpersonatingRole(null);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(IS_ADMIN_KEY);
  };

  // Handle reset (admin only)
  const handleReset = async () => {
    if (!isAdmin) return;
    await handleBackToHome();
  };

  // Handle granting host control (admin only)
  const handleGrantHost = (role: string) => {
    if (!isAdmin) return;
    setHostRole(role);
  };

  // Check if can start ceremony
  const nonAdminParticipants = participants.filter((p) => !p.isAdmin);
  const canStartCeremony = nonAdminParticipants.length >= 4;
  const waitingFor = ['advisor', 'studentlife', 'outgoing', 'incoming'].filter(
    (role) => !participants.some((p) => p.role === role)
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading ceremony...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow print:hidden"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 text-slate-600" />
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-xl p-4 w-64 border border-slate-200 print:hidden">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Accessibility</h3>
          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => handleToggleReduceMotion(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-600">Reduce motion</span>
          </label>

          {/* Host Controls - for admin or designated host */}
          {(isAdmin || (currentUserRole === hostRole && hostRole !== null)) && (
            <>
              <div className="border-t border-slate-200 pt-3 mt-3">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  {isAdmin ? 'Admin Controls' : 'Host Controls'}
                </h3>

                {/* Role Impersonation */}
                <div className="mb-3">
                  <label className="block text-xs text-slate-600 mb-2">
                    Appear as Role
                  </label>
                  <select
                    value={adminImpersonatingRole || ''}
                    onChange={(e) => setAdminImpersonatingRole(e.target.value || null)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">Select role to impersonate</option>
                    <option value="advisor">Club Advisor</option>
                    <option value="studentlife">Student Life Rep</option>
                    <option value="outgoing">Outgoing Rep</option>
                    <option value="incoming">Incoming Rep</option>
                  </select>
                  {adminImpersonatingRole && (
                    <p className="text-xs text-blue-600 mt-2">
                      Currently acting as:{' '}
                      {adminImpersonatingRole === 'advisor'
                        ? 'Club Advisor'
                        : adminImpersonatingRole === 'studentlife'
                        ? 'Student Life Rep'
                        : adminImpersonatingRole === 'outgoing'
                        ? 'Outgoing Rep'
                        : 'Incoming Rep'}
                    </p>
                  )}
                </div>

                {/* Grant Host Control - Admin only */}
                {isAdmin && (
                  <div className="mb-3">
                    <label className="block text-xs text-slate-600 mb-2">
                      Grant Host Control To
                    </label>
                    <select
                      value={hostRole || ''}
                      onChange={(e) => handleGrantHost(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="">None (Admin only)</option>
                      <option value="advisor">Club Advisor</option>
                      <option value="studentlife">Student Life Rep</option>
                      <option value="outgoing">Outgoing Rep</option>
                      <option value="incoming">Incoming Rep</option>
                    </select>
                    {hostRole && (
                      <p className="text-xs text-green-600 mt-2">
                        Host control granted to:{' '}
                        {hostRole === 'advisor'
                          ? 'Club Advisor'
                          : hostRole === 'studentlife'
                          ? 'Student Life Rep'
                          : hostRole === 'outgoing'
                          ? 'Outgoing Rep'
                          : 'Incoming Rep'}
                      </p>
                    )}
                  </div>
                )}

                {/* Reset Ceremony - Admin only */}
                {isAdmin && (
                  <button
                    onClick={handleReset}
                    className="w-full px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                  >
                    Reset Ceremony
                  </button>
                )}
              </div>
            </>
          )}

          {/* User Info & Logout */}
          <div className="border-t border-slate-200 pt-3 mt-3">
            <div className="text-xs text-slate-500 mb-3">
              {currentUserName && (
                <div>
                  Logged in as: <span className="text-slate-700">{currentUserName}</span>
                </div>
              )}
              {isAdmin && <div className="text-blue-600 mt-1">Admin Access Enabled</div>}
              {!isAdmin && currentUserRole === hostRole && hostRole && (
                <div className="text-green-600 mt-1">Host Control Enabled</div>
              )}
            </div>

            {/* Logout Button for all logged-in users */}
            {currentUserRole && (
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-lg shadow-lg max-w-md">
          <p className="text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-xs underline mt-1">
            Dismiss
          </button>
        </div>
      )}

      {/* Screen Router */}
      {currentScreen === 'landing' && (
        <LandingScreen
          participants={participants}
          onJoinRole={handleJoinRole}
          onStartCeremony={handleStartCeremony}
          canStart={canStartCeremony}
          currentUserRole={currentUserRole}
          onAdminProceed={handleAdminProceed}
          waitingFor={waitingFor}
        />
      )}

      {currentScreen === 'ceremony' && (
        <CeremonyScreen
          participants={participants}
          currentStep={currentStep}
          steps={ceremonySteps}
          onConfirmStep={handleConfirmStep}
          currentUserRole={
            (isAdmin || (currentUserRole === hostRole && hostRole !== null)) && adminImpersonatingRole
              ? adminImpersonatingRole
              : currentUserRole
          }
          reduceMotion={reduceMotion}
        />
      )}

      {currentScreen === 'celebration' && (
        <CelebrationScreen
          steps={ceremonySteps}
          onBackToHome={handleBackToHome}
          reduceMotion={reduceMotion}
        />
      )}
    </div>
  );
}
