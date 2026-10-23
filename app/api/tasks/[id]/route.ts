import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { tasks } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

// PATCH /api/tasks/[id] — mark task as done
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // Verify ownership
  const [existing] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const [updated] = await db
    .update(tasks)
    .set({
      status: 'done',
      completedAt: new Date(),
    })
    .where(eq(tasks.id, id))
    .returning();

  return NextResponse.json({ task: updated });
}
