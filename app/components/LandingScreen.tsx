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
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [accessCode, setAccessCode] = useState<string>('');
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [adminCode, setAdminCode] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setShowCodeInput(true);
  };

  const handleJoin = () => {
    if (selectedRole && accessCode) {
      onJoinRole(selectedRole, accessCode);
      setAccessCode('');
      setShowCodeInput(false);
      setSelectedRole('');
    }
  };

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
                Select your role and enter your access code to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showCodeInput ? (
                <div className="space-y-3">
                  {ROLE_OPTIONS.map((option) => {
                    const participant = getParticipantByRole(option.role);
                    const isJoined = !!participant;

                    return (
                      <button
                        key={option.role}
                        onClick={() => handleRoleSelect(option.role)}
                        disabled={isJoined}
                        className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                      >
                        <span className="text-slate-900">{option.label}</span>
                        {isJoined && (
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                            Joined
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">
                      Selected Role
                    </label>
                    <div className="p-3 bg-slate-100 rounded-lg text-slate-900">
                      {ROLE_OPTIONS.find((r) => r.role === selectedRole)?.label}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-600 mb-2">
                      Access Code
                    </label>
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      placeholder="Enter access code"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCodeInput(false);
                        setAccessCode('');
                        setSelectedRole('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleJoin} disabled={!accessCode} className="flex-1">
                      Join
                    </Button>
                  </div>

                  <div className="text-xs text-slate-500 text-center">
                    Or use your secure link to join automatically
                  </div>
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
                {visibleParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-slate-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0">
                      {participant.name ? participant.name.charAt(0) : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-900 truncate">
                        {participant.name || 'Waiting...'}
                      </div>
                      <div className="text-xs text-slate-500">{participant.roleLabel}</div>
                    </div>
                    <StatusChip
                      status={participant.status === 'joined' ? 'joined' : 'waiting'}
                      size="sm"
                    />
                  </div>
                ))}
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
