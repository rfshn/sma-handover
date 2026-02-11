'use client';

import { motion } from 'motion/react';
import { Download, Home } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 relative overflow-hidden print:min-h-[100vh] print:h-[100vh] print:py-6 print:px-8 print:bg-white print:overflow-hidden">
      {/* Confetti Effect - on top with z-50 */}
      <Confetti reduceMotion={reduceMotion} />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 print:hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/10 to-purple-100/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 print:max-w-full print:h-full print:flex print:flex-col">
        {/* Music Controls */}
        <div className="flex justify-end mb-8 print:hidden">
          <MusicPlayer reduceMotion={reduceMotion} />
        </div>

        {/* Main Content */}
        <Card className="text-center bg-white/80 backdrop-blur-sm border-2 border-white shadow-xl print:bg-white print:shadow-none print:border-0 print:flex-1">
          <CardContent className="py-12 px-8 print:py-6 print:px-6 print:h-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.6 }}
            >
              {/* SMA Logo at Top */}
              <motion.div
                className="flex justify-center mb-8 print:mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: reduceMotion ? 0 : 0.5 }}
              >
                <div className="w-24 h-24 print:w-20 print:h-20 bg-white rounded-full shadow-xl print:shadow-md flex items-center justify-center overflow-hidden border-4 border-blue-100 print:border-2">
                  <img
                    src="/SMA Logo.png"
                    alt="SMA Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Seal - Hidden in print as we have the official stamp */}
              <div className="flex justify-center mb-8 print:hidden">
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
                className="text-4xl print:text-3xl text-slate-900 mb-2 print:mb-1 font-bold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: reduceMotion ? 0 : 0.4 }}
              >
                Congratulations!
              </motion.h1>

              <motion.h2
                className="text-2xl print:text-xl text-slate-700 mb-4 print:mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: reduceMotion ? 0 : 0.4 }}
              >
                Incoming SMA Committee 2026
              </motion.h2>

              <motion.p
                className="text-base print:text-sm text-slate-600 mb-8 print:mb-4 max-w-2xl mx-auto leading-relaxed print:leading-normal"
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
                className="inline-block px-10 py-6 print:px-8 print:py-4 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white rounded-xl shadow-2xl print:shadow-md mb-8 print:mb-5 border-2 border-blue-400/30"
                initial={{ scale: 0, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: reduceMotion ? 0 : 0.5, type: 'spring' }}
              >
                <div className="text-sm print:text-sm mb-2 print:mb-1 opacity-90 uppercase tracking-wider">
                  Official Appointment
                </div>
                <div className="text-3xl print:text-2xl font-bold mb-2 print:mb-1">SMA Committee Term 2026</div>
                <div className="text-sm print:text-sm opacity-90">Formally Recognised • February 11, 2026</div>
              </motion.div>

              {/* Ceremony Steps Acknowledgment */}
              <motion.div
                className="max-w-3xl mx-auto mb-8 print:mb-5 print:max-w-full text-left"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: reduceMotion ? 0 : 0.5 }}
              >
                <h3 className="text-base print:text-base font-semibold text-slate-900 mb-4 print:mb-3 text-center">
                  Ceremony Acknowledgments
                </h3>
                <div className="grid grid-cols-2 gap-3 print:gap-3">
                  <div className="bg-white rounded-lg p-4 print:p-3 border-2 border-slate-300 shadow-sm print:shadow-none">
                    <div className="flex items-start gap-3 print:gap-2">
                      <div className="w-7 h-7 print:w-6 print:h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm print:text-sm font-semibold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm print:text-sm mb-1 print:mb-0">
                          Governance Acknowledgement
                        </div>
                        <div className="text-xs print:text-xs text-slate-700">
                          by <span className="font-medium">Ms. Justin</span> (Club Advisor)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 print:p-3 border-2 border-slate-300 shadow-sm print:shadow-none">
                    <div className="flex items-start gap-3 print:gap-2">
                      <div className="w-7 h-7 print:w-6 print:h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm print:text-sm font-semibold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm print:text-sm mb-1 print:mb-0">
                          Validation & Compliance
                        </div>
                        <div className="text-xs print:text-xs text-slate-700">
                          accepted by <span className="font-medium">Ms. Shazrina</span> (Student Life)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 print:p-3 border-2 border-slate-300 shadow-sm print:shadow-none">
                    <div className="flex items-start gap-3 print:gap-2">
                      <div className="w-7 h-7 print:w-6 print:h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm print:text-sm font-semibold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm print:text-sm mb-1 print:mb-0">
                          Formal Handover
                        </div>
                        <div className="text-xs print:text-xs text-slate-700">
                          by <span className="font-medium">Hasin</span> (Outgoing Vice President)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 print:p-3 border-2 border-slate-300 shadow-sm print:shadow-none">
                    <div className="flex items-start gap-3 print:gap-2">
                      <div className="w-7 h-7 print:w-6 print:h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm print:text-sm font-semibold flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm print:text-sm mb-1 print:mb-0">
                          Appointment Acceptance
                        </div>
                        <div className="text-xs print:text-xs text-slate-700">
                          by <span className="font-medium">Umar</span> (Incoming President)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Group Photo */}
              <motion.div
                className="max-w-3xl mx-auto mb-8 print:mb-5 print:max-w-full"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.65, duration: reduceMotion ? 0 : 0.5 }}
              >
                <h3 className="text-base print:text-base font-semibold text-slate-900 mb-3 print:mb-2 text-center">
                  2026 SMA Committee
                </h3>
                <div className="w-full rounded-xl print:rounded-lg border-2 border-slate-300 shadow-sm print:shadow-none overflow-hidden">
                  <img
                    src="/new_committee.JPEG"
                    alt="2026 SMA Committee Team Photo"
                    className="w-full h-auto object-cover print:w-full print:max-h-[200px] print:object-contain"
                  />
                </div>
              </motion.div>

              {/* Formal Closing Statement - Signatures */}
              <motion.div
                className="max-w-3xl mx-auto mb-8 print:mb-4 print:max-w-full p-6 print:p-4 bg-white rounded-lg border-2 border-slate-300"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: reduceMotion ? 0 : 0.5 }}
              >
                <div className="flex items-center justify-between gap-4 print:gap-4 text-center text-sm print:text-sm text-slate-700">
                  <div className="flex-1 border-b border-slate-300 pb-2 print:pb-2">
                    <div className="font-semibold text-slate-900 mb-1 print:mb-1">Ms. Justin</div>
                    <div className="text-xs print:text-xs">Club Advisor</div>
                  </div>
                  <div className="flex-1 border-b border-slate-300 pb-2 print:pb-2">
                    <div className="font-semibold text-slate-900 mb-1 print:mb-1">Ms. Shazrina</div>
                    <div className="text-xs print:text-xs">Student Life Representative</div>
                  </div>
                  <div className="flex-1 border-b border-slate-300 pb-2 print:pb-2">
                    <div className="font-semibold text-slate-900 mb-1 print:mb-1">Hasin</div>
                    <div className="text-xs print:text-xs">Outgoing Vice President</div>
                  </div>
                  <div className="flex-1 border-b border-slate-300 pb-2 print:pb-2">
                    <div className="font-semibold text-slate-900 mb-1 print:mb-1">Umar</div>
                    <div className="text-xs print:text-xs">Incoming President</div>
                  </div>
                </div>
              </motion.div>

              {/* Footer for print only */}
              <div className="hidden print:block text-center text-xs text-slate-500 mt-4">
                <p>Sunway Maldivian Association • Established 2020 • Sunway University</p>
              </div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden"
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
                  onClick={() => {
                    window.print();
                  }}
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
          className="mt-8 text-center print:hidden"
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
  );
}
