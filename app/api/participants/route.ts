import { NextResponse } from 'next/server';
import { getParticipants, addParticipant, getParticipant } from '@/lib/store';
import { PARTICIPANT_ROLES } from '@/app/types';

export async function GET() {
  try {
    const participants = await getParticipants();
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    // Validate access code
    if (!code || !PARTICIPANT_ROLES[code]) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 400 }
      );
    }

    // Check if participant already joined
    const existingParticipant = await getParticipant(code);
    if (existingParticipant) {
      return NextResponse.json(existingParticipant);
    }

    // Get role info
    const roleInfo = PARTICIPANT_ROLES[code];

    // Create participant
    const participant = {
      code,
      name: roleInfo.name,
      role: roleInfo.role,
      label: roleInfo.label,
      joinedAt: new Date().toISOString(),
      isAdmin: roleInfo.isAdmin || false,
    };

    const savedParticipant = await addParticipant(participant);
    return NextResponse.json(savedParticipant);
  } catch (error) {
    console.error('Error joining ceremony:', error);
    return NextResponse.json(
      { error: 'Failed to join ceremony' },
      { status: 500 }
    );
  }
}
