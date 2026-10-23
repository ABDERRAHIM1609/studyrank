import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { tasks } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/tasks?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'date parameter is required' }, { status: 400 });
  }

  const userTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, session.user.id), eq(tasks.date, date)))
    .orderBy(tasks.createdAt);

  return NextResponse.json({ tasks: userTasks });
}

// POST /api/tasks — create a task
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, date } = body;

  if (!title || !date) {
    return NextResponse.json(
      { error: 'title and date are required' },
      { status: 400 }
    );
  }

  const [newTask] = await db
    .insert(tasks)
    .values({
      userId: session.user.id,
      title: title.trim(),
      date,
      status: 'todo',
    })
    .returning();

  return NextResponse.json({ task: newTask }, { status: 201 });
}
