'use client';

import { motion } from 'motion/react';
import { Check, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusChip } from './design-system/StatusChip';
import { ProgressIndicator } from './design-system/ProgressIndicator';
import { DigitalSeal } from './design-system/DigitalSeal';
import { MusicPlayer } from './design-system/MusicPlayer';
import { Participant, CeremonyStep, PARTICIPANT_ROLES } from '@/app/types';
import { clsx } from 'clsx';

interface CeremonyScreenProps {
  participants: Participant[];
  currentStep: number;
  steps: CeremonyStep[];
  onConfirmStep: (stepId: number) => void;
  currentUserRole: string | null;
  reduceMotion: boolean;
}

const STEP_LABELS = ['Governance', 'Validation', 'Handover', 'Acceptance'];

const ACTION_LABELS: Record<number, string> = {
  1: 'Acknowledge Governance',
  2: 'Validate Compliance',
  3: 'Complete Handover',
  4: 'Accept Appointment',
};

export function CeremonyScreen({
  participants,
  currentStep,
  steps,
  onConfirmStep,
  currentUserRole,
  reduceMotion,
}: CeremonyScreenProps) {
  const [showCursor, setShowCursor] = useState(false);

  const activeStep = steps[currentStep - 1];
  const isUserTurn = activeStep && activeStep.responsibleRole === currentUserRole;
  const completedSteps = steps.filter((s) => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  // Get role label
  const getRoleLabel = (role: string): string => {
    const roleEntry = Object.values(PARTICIPANT_ROLES).find((r) => r.role === role);
    return roleEntry?.label || role;
  };

  // Get participant name by role
  const getParticipantNameByRole = (role: string): string => {
    const participant = participants.find((p) => p.role === role);
    if (participant) return participant.name;
    const roleEntry = Object.values(PARTICIPANT_ROLES).find((r) => r.role === role);
    return roleEntry?.name || 'Unknown';
  };

  const handleConfirm = () => {
    if (activeStep && !activeStep.completed) {
      // Show cursor effect briefly
      setShowCursor(true);
      setTimeout(() => setShowCursor(false), 1500);

      onConfirmStep(activeStep.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Music Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden">
              <img
                src="/SMA Logo.png"
                alt="SMA Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">SMA Handover Ceremony</h1>
          </div>

          <MusicPlayer reduceMotion={reduceMotion} />
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={steps.length}
            completedSteps={completedSteps}
            stepLabels={STEP_LABELS}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Ceremony Stage */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl relative overflow-hidden">
              {/* Cursor spotlight effect */}
              {showCursor && !reduceMotion && (
                <motion.div
                  className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"
                  initial={{ x: '50%', y: '50%', opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5 }}
                />
              )}

              <CardContent className="py-12 px-8">
                <div className="text-center mb-8">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4 }}
                  >
                    <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-sm text-slate-600 mb-4">
                      Step {currentStep} of {steps.length}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">{activeStep?.title}</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                      {activeStep?.description}
                    </p>
                  </motion.div>
                </div>

                {/* Digital Seal */}
                <div className="flex justify-center mb-8">
                  <DigitalSeal
                    progress={progress}
                    stepsCompleted={completedSteps}
                    totalSteps={steps.length}
                    showFinalStamp={completedSteps === steps.length}
                    reduceMotion={reduceMotion}
                  />
                </div>

                {/* Action Button or Completed State */}
                {activeStep?.completed ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-lg text-emerald-700">
                      <Check className="w-5 h-5" />
                      <span>
                        Confirmed by: {getParticipantNameByRole(activeStep.responsibleRole)}
                      </span>
                    </div>
                    {activeStep.completedAt && (
                      <div className="text-sm text-slate-500 mt-2">
                        {new Date(activeStep.completedAt).toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                ) : isUserTurn ? (
                  <div className="text-center">
                    <Button size="lg" onClick={handleConfirm} className="min-w-[200px]">
                      {ACTION_LABELS[activeStep?.id || 1] || 'Confirm Step'}
                    </Button>
                    <p className="text-sm text-slate-500 mt-3">
                      You are required to confirm this step
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-lg text-slate-600">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                      <span>
                        Waiting for {getParticipantNameByRole(activeStep?.responsibleRole || '')}...
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed Steps Timeline */}
            {completedSteps > 0 && (
              <Card className="shadow-lg border border-slate-200">
                <CardContent className="py-6">
                  <h3 className="text-sm font-semibold text-slate-600 mb-4">Completed Steps</h3>
                  <div className="space-y-3">
                    {steps
                      .filter((s) => s.completed)
                      .map((step) => (
                        <div key={step.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900">{step.title}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {getParticipantNameByRole(step.responsibleRole)}
                              {step.completedAt && (
                                <> • {new Date(step.completedAt).toLocaleTimeString()}</>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Participants Panel */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl sticky top-8">
              <CardContent className="py-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Participants</h3>
                </div>

                <div className="space-y-3">
                  {participants
                    .filter((p) => !p.isAdmin)
                    .map((participant) => {
                      const participantStep = steps.find(
                        (s) => s.responsibleRole === participant.role
                      );
                      const isActive =
                        activeStep?.responsibleRole === participant.role && !activeStep.completed;
                      const hasConfirmed = participantStep?.completed;

                      return (
                        <div
                          key={participant.code}
                          className={clsx(
                            'p-3 rounded-lg border transition-all',
                            isActive
                              ? 'border-slate-400 bg-slate-50 ring-2 ring-slate-200'
                              : 'border-slate-200'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0">
                              {participant.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900 truncate">
                                {participant.name}
                              </div>
                              <div className="text-xs text-slate-500 mb-2">{participant.label}</div>
                              <StatusChip status="joined" size="sm" />

                              {hasConfirmed && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                                  <Check className="w-3 h-3" />
                                  <span>Step confirmed</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Connection Status */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Connection</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-slate-600">Stable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
