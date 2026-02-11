export interface Participant {
  code: string;
  name: string;
  role: string;
  label: string;
  joinedAt: string;
  isAdmin?: boolean;
}

export interface CeremonyStep {
  id: number;
  title: string;
  description: string;
  responsibleRole: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
}

export type AppScreen = 'landing' | 'ceremony' | 'celebration';

export interface CeremonyState {
  currentStep: number;
  isComplete: boolean;
}

export const PARTICIPANT_ROLES: Record<string, { name: string; role: string; label: string; isAdmin?: boolean }> = {
  ADV2026: { name: "Ms. Justin", role: "advisor", label: "Club Advisor" },
  SL2026: { name: "Ms. Shazrina", role: "studentlife", label: "Student Life Representative" },
  OUT2026: { name: "Hasin", role: "outgoing", label: "Outgoing Vice President" },
  INC2026: { name: "Umar", role: "incoming", label: "Incoming President" },
  ADMIN2026: { name: "Admin", role: "admin", label: "Super User", isAdmin: true }
};

export const CEREMONY_STEPS: Omit<CeremonyStep, 'completed' | 'completedBy' | 'completedAt'>[] = [
  {
    id: 1,
    title: "Governance Acknowledgement",
    description: "Club Advisor confirms committee formation and governance compliance",
    responsibleRole: "advisor"
  },
  {
    id: 2,
    title: "Validation & Compliance",
    description: "Student Life Representative validates the handover process",
    responsibleRole: "studentlife"
  },
  {
    id: 3,
    title: "Formal Handover",
    description: "Outgoing representative officially transfers responsibilities",
    responsibleRole: "outgoing"
  },
  {
    id: 4,
    title: "Appointment Acceptance",
    description: "Incoming representative accepts the appointment",
    responsibleRole: "incoming"
  }
];
