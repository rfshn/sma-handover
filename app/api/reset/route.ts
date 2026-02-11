import { NextResponse } from 'next/server';
import { resetCeremony } from '@/lib/store';

export async function POST() {
  try {
    await resetCeremony();
    return NextResponse.json({
      success: true,
      message: 'Ceremony has been reset',
    });
  } catch (error) {
    console.error('Error resetting ceremony:', error);
    return NextResponse.json(
      { error: 'Failed to reset ceremony' },
      { status: 500 }
    );
  }
}
