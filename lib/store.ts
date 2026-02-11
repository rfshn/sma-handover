// Store for ceremony state - uses Supabase in production, in-memory for dev
import { Participant, CeremonyState } from '@/app/types';
import { supabase, isSupabaseConfigured } from './supabase';

// ============================================
// In-Memory Fallback Store (for local development)
// ============================================

interface InMemoryStore {
  participants: Map<string, Participant>;
  ceremonySteps: Map<number, { completed: boolean; completedBy?: string; completedAt?: string }>;
  ceremonyState: CeremonyState;
}

const memoryStore: InMemoryStore = {
  participants: new Map(),
  ceremonySteps: new Map(),
  ceremonyState: { currentStep: 1, isComplete: false }
};

// ============================================
// Supabase KV Store Functions
// ============================================

// KV table structure: { key: string, value: jsonb }
const KV_TABLE = 'ceremony_kv';

async function kvGet(key: string): Promise<unknown | null> {
  if (!supabase) {
    console.log('[KV] Supabase not configured, using memory store');
    return null;
  }

  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle();  // Use maybeSingle() instead of single() to handle 0 rows

  if (error) {
    console.error('[KV] Error getting key:', key, error.message);
    return null;
  }
  return data?.value ?? null;
}

async function kvSet(key: string, value: unknown): Promise<boolean> {
  if (!supabase) {
    console.log('[KV] Supabase not configured, using memory store');
    return false;
  }

  const { error } = await supabase
    .from(KV_TABLE)
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) {
    console.error('[KV] Error setting key:', key, error.message);
    return false;
  }
  console.log('[KV] Successfully set key:', key);
  return true;
}

async function kvDelete(key: string): Promise<void> {
  if (!supabase) return;

  await supabase
    .from(KV_TABLE)
    .delete()
    .eq('key', key);
}

async function kvGetByPrefix(prefix: string): Promise<{ key: string; value: unknown }[]> {
  if (!supabase) {
    console.log('[KV] Supabase not configured for getByPrefix');
    return [];
  }

  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('key, value')
    .like('key', `${prefix}%`);

  if (error) {
    console.error('[KV] Error getting by prefix:', prefix, error.message);
    return [];
  }
  console.log('[KV] Got', data?.length ?? 0, 'items for prefix:', prefix);
  return data ?? [];
}

async function kvDeleteByPrefix(prefix: string): Promise<void> {
  if (!supabase) return;

  await supabase
    .from(KV_TABLE)
    .delete()
    .like('key', `${prefix}%`);
}

// ============================================
// Unified Store API
// ============================================

export async function getParticipants(): Promise<Participant[]> {
  if (isSupabaseConfigured) {
    const entries = await kvGetByPrefix('participant:');
    return entries
      .map(e => e.value as Participant)
      .filter(p => !p.isAdmin);
  }

  // Fallback to memory store
  return Array.from(memoryStore.participants.values()).filter(p => !p.isAdmin);
}

export async function getParticipant(code: string): Promise<Participant | null> {
  if (isSupabaseConfigured) {
    const value = await kvGet(`participant:${code}`);
    return value as Participant | null;
  }

  // Fallback to memory store
  return memoryStore.participants.get(code) || null;
}

export async function addParticipant(participant: Participant): Promise<Participant> {
  if (isSupabaseConfigured) {
    await kvSet(`participant:${participant.code}`, participant);
    return participant;
  }

  // Fallback to memory store
  memoryStore.participants.set(participant.code, participant);
  return participant;
}

export async function getCeremonySteps(): Promise<{ stepId: number; completed: boolean; completedBy?: string; completedAt?: string }[]> {
  const steps: { stepId: number; completed: boolean; completedBy?: string; completedAt?: string }[] = [];

  for (let i = 1; i <= 4; i++) {
    let step: { completed: boolean; completedBy?: string; completedAt?: string } | null = null;

    if (isSupabaseConfigured) {
      step = await kvGet(`ceremony:step:${i}`) as typeof step;
    } else {
      step = memoryStore.ceremonySteps.get(i) || null;
    }

    steps.push({
      stepId: i,
      completed: step?.completed ?? false,
      completedBy: step?.completedBy,
      completedAt: step?.completedAt
    });
  }

  return steps;
}

export async function completeStep(stepId: number, participantCode: string): Promise<void> {
  const stepData = {
    completed: true,
    completedBy: participantCode,
    completedAt: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    await kvSet(`ceremony:step:${stepId}`, stepData);

    // Update ceremony state
    const steps = await getCeremonySteps();
    const completedCount = steps.filter(s => s.completed).length;
    await kvSet('ceremony:state', {
      currentStep: Math.min(completedCount + 1, 4),
      isComplete: completedCount === 4
    });
  } else {
    // Fallback to memory store
    memoryStore.ceremonySteps.set(stepId, stepData);

    const completedCount = Array.from(memoryStore.ceremonySteps.values()).filter(s => s.completed).length;
    memoryStore.ceremonyState = {
      currentStep: Math.min(completedCount + 1, 4),
      isComplete: completedCount === 4
    };
  }
}

export async function getCeremonyState(): Promise<CeremonyState> {
  if (isSupabaseConfigured) {
    const state = await kvGet('ceremony:state') as CeremonyState | null;
    return state || { currentStep: 1, isComplete: false };
  }

  // Fallback to memory store
  return memoryStore.ceremonyState;
}

export async function resetCeremony(): Promise<void> {
  if (isSupabaseConfigured) {
    await kvDeleteByPrefix('participant:');
    await kvDeleteByPrefix('ceremony:');
  } else {
    // Fallback to memory store
    memoryStore.participants.clear();
    memoryStore.ceremonySteps.clear();
    memoryStore.ceremonyState = { currentStep: 1, isComplete: false };
  }
}
