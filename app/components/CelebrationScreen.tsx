'use client';

import { motion } from 'motion/react';
import { Download, Home, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DigitalSeal } from './design-system/DigitalSeal';
import { Confetti } from './design-system/Confetti';
import { MusicPlayer } from './design-system/MusicPlayer';
import { CeremonyStep } from '@/app/types';

interface CelebrationScreenProps {
  steps: CeremonyStep[];
  onBackToHome: () => void;
  reduceMotion: boolean;
}

export function CelebrationScreen({
  steps,
  onBackToHome,
  reduceMotion,
}: CelebrationScreenProps) {
  return (
    <>
      {/* SCREEN VERSION */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 relative overflow-hidden print:hidden">
        {/* Confetti Effect */}
        <Confetti reduceMotion={reduceMotion} />

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/10 to-purple-100/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Music Controls */}
          <div className="flex justify-end mb-8">
            <MusicPlayer reduceMotion={reduceMotion} />
          </div>

          {/* Main Content */}
          <Card className="text-center bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl">
            <CardContent className="py-12 px-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.6 }}
              >
                {/* SMA Logo at Top */}
                <motion.div
                  className="flex justify-center mb-8"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: reduceMotion ? 0 : 0.5 }}
                >
                  <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center overflow-hidden border-4 border-blue-100">
                    <img
                      src="/SMA Logo.png"
                      alt="SMA Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Digital Seal */}
                <div className="flex justify-center mb-8">
                  <DigitalSeal
                    progress={100}
                    stepsCompleted={4}
                    totalSteps={4}
                    showFinalStamp={true}
                    reduceMotion={reduceMotion}
                  />
                </div>

                {/* Headline */}
                <motion.h1
                  className="text-4xl text-slate-900 mb-2 font-bold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: reduceMotion ? 0 : 0.4 }}
                >
                  Congratulations!
                </motion.h1>

                <motion.h2
                  className="text-2xl text-slate-700 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: reduceMotion ? 0 : 0.4 }}
                >
                  Incoming SMA Committee 2026
                </motion.h2>

                <motion.p
                  className="text-base text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: reduceMotion ? 0 : 0.4 }}
                >
                  The handover ceremony has been completed successfully. We look forward to your
                  leadership in guiding the Sunway Maldivian Association to new heights of excellence
                  throughout 2026.
                </motion.p>

                {/* Official Stamp Text */}
                <motion.div
                  className="inline-block px-10 py-6 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white rounded-xl shadow-2xl mb-8 border-2 border-blue-400/30"
                  initial={{ scale: 0, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: reduceMotion ? 0 : 0.5, type: 'spring' }}
                >
                  <div className="text-sm mb-2 opacity-90 uppercase tracking-wider">
                    Official Appointment
                  </div>
                  <div className="text-3xl font-bold mb-2">SMA Committee Term 2026</div>
                  <div className="text-sm opacity-90">Formally Recognised • February 11, 2026</div>
                </motion.div>

                {/* Ceremony Steps Acknowledgment */}
                <motion.div
                  className="max-w-3xl mx-auto mb-8 text-left"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: reduceMotion ? 0 : 0.5 }}
                >
                  <h3 className="text-base font-semibold text-slate-900 mb-4 text-center">
                    Ceremony Acknowledgments
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { num: 1, title: 'Governance Acknowledgement', by: 'Ms. Justin', role: 'Club Advisor' },
                      { num: 2, title: 'Validation & Compliance', by: 'Ms. Shazrina', role: 'Student Life' },
                      { num: 3, title: 'Formal Handover', by: 'Hasin', role: 'Outgoing Vice President' },
                      { num: 4, title: 'Appointment Acceptance', by: 'Umar', role: 'Incoming President' },
                    ].map((item) => (
                      <div key={item.num} className="bg-white rounded-lg p-4 border-2 border-slate-300 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                            {item.num}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm mb-1">{item.title}</div>
                            <div className="text-xs text-slate-700">
                              by <span className="font-medium">{item.by}</span> ({item.role})
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Group Photo */}
                <motion.div
                  className="max-w-3xl mx-auto mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.65, duration: reduceMotion ? 0 : 0.5 }}
                >
                  <h3 className="text-base font-semibold text-slate-900 mb-3 text-center">
                    2026 SMA Committee
                  </h3>
                  <div className="w-full rounded-xl border-2 border-slate-300 shadow-sm overflow-hidden">
                    <img
                      src="/new_committee.JPEG"
                      alt="2026 SMA Committee Team Photo"
                      className="w-full h-auto"
                    />
                  </div>
                </motion.div>

                {/* Formal Closing Statement - Signatures */}
                <motion.div
                  className="max-w-3xl mx-auto mb-8 p-6 bg-white rounded-lg border-2 border-slate-300"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: reduceMotion ? 0 : 0.5 }}
                >
                  <div className="flex items-center justify-between gap-4 text-center text-sm text-slate-700">
                    {[
                      { name: 'Ms. Justin', role: 'Club Advisor' },
                      { name: 'Ms. Shazrina', role: 'Student Life Representative' },
                      { name: 'Hasin', role: 'Outgoing Vice President' },
                      { name: 'Umar', role: 'Incoming President' },
                    ].map((person) => (
                      <div key={person.name} className="flex-1 border-b border-slate-300 pb-2">
                        <div className="font-semibold text-slate-900 mb-1">{person.name}</div>
                        <div className="text-xs">{person.role}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: reduceMotion ? 0 : 0.4 }}
                >
                  <Button size="lg" onClick={onBackToHome} className="min-w-[200px]">
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="min-w-[200px]"
                    onClick={() => window.print()}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Certificate
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Footer Message */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <p className="text-slate-600 mb-2">
              Thank you to all participants for making this ceremony possible.
            </p>
            <p className="text-sm text-slate-500">
              Sunway Maldivian Association • Established 2020 • Sunway University
            </p>
          </motion.div>
        </div>
      </div>

      {/* PRINT VERSION - Optimized for A4, similar layout to screen */}
      <div className="hidden print:block print:w-full print:p-6">
        <div className="text-center">
          {/* SMA Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200 shadow">
              <img src="/SMA Logo.png" alt="SMA Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Digital Seal with Corner Brackets */}
          <div className="flex justify-center mb-4">
            <div className="relative" style={{ width: '120px', height: '120px' }}>
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-slate-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-slate-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-slate-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-slate-400" />

              {/* SVG Ring */}
              <svg className="absolute inset-0" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)' }}
                >
                  <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  <span className="text-white text-[8px] font-semibold mt-0.5">SMA Committee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Congratulations!</h1>
          <h2 className="text-lg text-slate-700 mb-2">Incoming SMA Committee 2026</h2>

          {/* Description */}
          <p className="text-[11px] text-slate-600 mb-4 max-w-lg mx-auto leading-relaxed">
            The handover ceremony has been completed successfully. We look forward to your leadership in guiding the Sunway Maldivian Association to new heights of excellence throughout 2026.
          </p>

          {/* Official Appointment Badge */}
          <div className="mb-4">
            <div
              className="inline-block px-8 py-3 text-white rounded-xl"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #7e22ce 100%)' }}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-90 mb-1">Official Appointment</div>
              <div className="text-xl font-bold mb-1">SMA Committee Term 2026</div>
              <div className="text-[10px] opacity-90">Formally Recognised • February 11, 2026</div>
            </div>
          </div>

          {/* Ceremony Acknowledgments */}
          <div className="mb-4 text-left max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold text-slate-900 mb-2 text-center">Ceremony Acknowledgments</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { num: 1, title: 'Governance Acknowledgement', by: 'Ms. Justin', role: 'Club Advisor' },
                { num: 2, title: 'Validation & Compliance', by: 'Ms. Shazrina', role: 'Student Life' },
                { num: 3, title: 'Formal Handover', by: 'Hasin', role: 'Outgoing VP' },
                { num: 4, title: 'Appointment Acceptance', by: 'Umar', role: 'Incoming President' },
              ].map((item) => (
                <div key={item.num} className="flex items-start gap-2 p-2 border border-slate-300 rounded">
                  <div className="w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                    {item.num}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-900">{item.title}</div>
                    <div className="text-[10px] text-slate-600">by {item.by} ({item.role})</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group Photo - Sized to fit on one page */}
          <div className="mb-4 mx-auto" style={{ maxWidth: '100%' }}>
            <h3 className="text-sm font-semibold text-slate-900 mb-2 text-center">2026 SMA Committee</h3>
            <div className="w-full border-2 border-slate-300 rounded-lg overflow-hidden" style={{ height: '290px' }}>
              <img
                src="/new_committee.JPEG"
                alt="2026 SMA Committee Team Photo"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Signatures */}
          <div className="max-w-2xl mx-auto mb-3 p-3 border border-slate-300 rounded-lg">
            <div className="flex justify-between gap-3 text-center">
              {[
                { name: 'Ms. Justin', role: 'Club Advisor' },
                { name: 'Ms. Shazrina', role: 'Student Life' },
                { name: 'Hasin', role: 'Outgoing VP' },
                { name: 'Umar', role: 'Incoming President' },
              ].map((person) => (
                <div key={person.name} className="flex-1 border-b border-slate-300 pb-1">
                  <div className="text-[11px] font-semibold text-slate-900">{person.name}</div>
                  <div className="text-[9px] text-slate-600">{person.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-slate-500">
            Sunway Maldivian Association • Established 2020 • Sunway University
          </div>
        </div>
      </div>
    </>
  );
}
