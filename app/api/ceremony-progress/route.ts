import { NextResponse } from 'next/server';
import { getCeremonySteps, completeStep, getCeremonyState } from '@/lib/store';
import { CEREMONY_STEPS, PARTICIPANT_ROLES } from '@/app/types';

export async function GET() {
  try {
    const steps = await getCeremonySteps();
    const state = await getCeremonyState();

    // Merge step definitions with completion status
    const fullSteps = CEREMONY_STEPS.map((stepDef, index) => {
      const stepStatus = steps[index];
      return {
        ...stepDef,
        completed: stepStatus?.completed || false,
        completedBy: stepStatus?.completedBy,
        completedAt: stepStatus?.completedAt,
      };
    });

    return NextResponse.json({
      steps: fullSteps,
      state,
    });
  } catch (error) {
    console.error('Error fetching ceremony progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ceremony progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stepId, participantCode } = body;

    // Validate step ID
    if (!stepId || stepId < 1 || stepId > 4) {
      return NextResponse.json(
        { error: 'Invalid step ID' },
        { status: 400 }
      );
    }

    // Validate participant code
    if (!participantCode || !PARTICIPANT_ROLES[participantCode]) {
      return NextResponse.json(
        { error: 'Invalid participant code' },
        { status: 400 }
      );
    }

    // Get step definition
    const stepDef = CEREMONY_STEPS.find((s) => s.id === stepId);
    if (!stepDef) {
      return NextResponse.json(
        { error: 'Step not found' },
        { status: 404 }
      );
    }

    // Check if participant is responsible for this step (or is admin)
    const participantRole = PARTICIPANT_ROLES[participantCode];
    const isAdmin = participantRole.isAdmin;
    const isResponsible = participantRole.role === stepDef.responsibleRole;

    if (!isAdmin && !isResponsible) {
      return NextResponse.json(
        { error: 'You are not responsible for this step' },
        { status: 403 }
      );
    }

    // Complete the step
    await completeStep(stepId, participantCode);

    // Get updated state
    const state = await getCeremonyState();

    return NextResponse.json({
      success: true,
      stepId,
      completedBy: participantCode,
      completedAt: new Date().toISOString(),
      ceremonyState: state,
    });
  } catch (error) {
    console.error('Error updating ceremony progress:', error);
    return NextResponse.json(
      { error: 'Failed to update ceremony progress' },
      { status: 500 }
    );
  }
}
