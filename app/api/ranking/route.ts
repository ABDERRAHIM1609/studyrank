import { NextRequest, NextResponse } from 'next/server';
import { calculateUserDailyRanking } from '@/lib/ranking';

// POST /api/ranking
// Body: { userId: string, date: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, date } = body;

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'userId and date are required' },
        { status: 400 }
      );
    }

    const result = await calculateUserDailyRanking(userId, date);

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Ranking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
