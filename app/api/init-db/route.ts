import { NextResponse } from 'next/server';
import { ensureDatabaseTables } from '@/lib/db';

export async function GET() {
  try {
    await ensureDatabaseTables();
    return NextResponse.json({
      success: true,
      message: 'Neon database tables created successfully!',
    });
  } catch (error: any) {
    console.error('Init DB error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to initialize database tables.',
      },
      { status: 500 }
    );
  }
}
