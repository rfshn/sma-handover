'use client';

import { useState } from 'react';
import { Shield, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusChip } from './design-system/StatusChip';
import { Participant, PARTICIPANT_ROLES } from '@/app/types';

interface LandingScreenProps {
  participants: Participant[];
  onJoinRole: (role: string, accessCode: string) => void;
  onStartCeremony: () => void;
  canStart: boolean;
  currentUserRole: string | null;
  onAdminProceed: (adminCode: string) => void;
  waitingFor: string[];
}

const ROLE_OPTIONS = [
  { role: 'advisor', label: 'Club Advisor (Ms. Justin)', code: 'JUSTIN26' },
  { role: 'studentlife', label: 'Student Life (Ms. Shazrina)', code: 'SHAZRINA26' },
  { role: 'outgoing', label: 'Outgoing Representative', code: 'HASIN26' },
  { role: 'incoming', label: 'Incoming Representative', code: 'UMAR26' },
];

export function LandingScreen({
  participants,
  onJoinRole,
  onStartCeremony,
  canStart,
  currentUserRole,
  onAdminProceed,
  waitingFor,
}: LandingScreenProps) {
  const [accessCode, setAccessCode] = useState<string>('');
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [adminCode, setAdminCode] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

  const handleProceedAnywayClick = () => {
    setShowAdminModal(true);
    setAdminCode('');
    setAdminError('');
  };

  const handleAdminProceed = () => {
    if (adminCode === 'MASTER26') {
      onAdminProceed(adminCode);
      setShowAdminModal(false);
      setAdminCode('');
      setAdminError('');
    } else {
      setAdminError('Invalid admin code');
    }
  };

  const getParticipantByRole = (role: string) => {
    return participants.find((p) => p.role === role);
  };

  // Filter out admin from display
  const visibleParticipants = ROLE_OPTIONS.map((option) => {
    const participant = getParticipantByRole(option.role);
    return {
      id: option.role,
      role: option.role,
      roleLabel: option.label,
      name: participant?.name || 'Waiting...',
      status: participant ? 'joined' : 'not-joined',
    };
  });

  const waitingForLabels = waitingFor.map((role) => {
    const option = ROLE_OPTIONS.find((r) => r.role === role);
    return option?.label.split('(')[0].trim() || role;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg overflow-hidden">
            <img
              src="/SMA Logo.png"
              alt="SMA Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            SMA Online AGM Handover Ceremony
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span>February 11, 2026 • 5:00 PM</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Join Ceremony Card */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Join Ceremony</CardTitle>
              <CardDescription>
                {currentUserRole
                  ? 'You have successfully joined the ceremony'
                  : 'Enter your access code to join'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* User has already joined - show their status */}
              {currentUserRole && currentUserRole !== 'admin' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">You're In!</h3>
                  <p className="text-slate-600 mb-1">
                    Joined as: <span className="font-medium">{ROLE_OPTIONS.find(r => r.role === currentUserRole)?.label || currentUserRole}</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    Waiting for other participants to join...
                  </p>
                </div>
              ) : currentUserRole === 'admin' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Admin Mode</h3>
                  <p className="text-slate-600">
                    You have full control over the ceremony
                  </p>
                </div>
              ) : (
                /* Not joined yet - show code entry */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">
                      Access Code
                    </label>
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      placeholder="Enter your access code"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-center text-lg tracking-wider"
                      onKeyDown={(e) => e.key === 'Enter' && accessCode && onJoinRole('', accessCode)}
                    />
                  </div>
                  <Button
                    onClick={() => onJoinRole('', accessCode)}
                    disabled={!accessCode}
                    className="w-full"
                    size="lg"
                  >
                    Join Ceremony
                  </Button>
                  <p className="text-xs text-slate-500 text-center">
                    Enter the access code you received to join
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lobby Presence Panel */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                Ceremony will begin when all required participants have joined
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visibleParticipants.map((participant) => {
                  const isCurrentUser = currentUserRole === participant.role;
                  const hasJoined = participant.status === 'joined';

                  return (
                    <div
                      key={participant.id}
                      className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${
                        isCurrentUser
                          ? 'border-emerald-400 bg-emerald-50'
                          : hasJoined
                          ? 'border-slate-300 bg-slate-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        hasJoined
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}>
                        {hasJoined ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-lg">?</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`truncate ${hasJoined ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                          {hasJoined ? participant.name : 'Waiting to join...'}
                        </div>
                        <div className="text-xs text-slate-500">{participant.roleLabel}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrentUser && (
                          <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded font-medium">
                            You
                          </span>
                        )}
                        <StatusChip
                          status={hasJoined ? 'joined' : 'waiting'}
                          size="sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start Ceremony Section */}
        <Card className="shadow-xl text-center">
          <CardContent className="py-8">
            {canStart ? (
              <>
                <p className="text-slate-600 mb-4">
                  All participants are ready. You may begin the ceremony.
                </p>
                <Button size="lg" onClick={onStartCeremony}>
                  Start Ceremony
                </Button>
              </>
            ) : (
              <>
                <p className="text-slate-600 mb-4">
                  {waitingForLabels.length > 0 ? (
                    <>Waiting for: {waitingForLabels.join(', ')}</>
                  ) : (
                    <>All required participants have joined. Ready to start.</>
                  )}
                </p>
                <div className="flex flex-col items-center gap-3">
                  <Button size="lg" disabled onClick={onStartCeremony}>
                    Start Ceremony
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleProceedAnywayClick}>
                    Proceed Anyway
                  </Button>
                </div>
              </>
            )}

            {/* Connection Status */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>Connected</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Code Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                Admin Authentication Required
              </CardTitle>
              <CardDescription>
                Enter the admin code to proceed without all participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Admin Code</label>
                  <input
                    type="password"
                    value={adminCode}
                    onChange={(e) => {
                      setAdminCode(e.target.value.toUpperCase());
                      setAdminError('');
                    }}
                    placeholder="Enter admin code"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminProceed()}
                    autoFocus
                  />
                  {adminError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{adminError}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAdminModal(false);
                      setAdminCode('');
                      setAdminError('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAdminProceed} disabled={!adminCode} className="flex-1">
                    Proceed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
