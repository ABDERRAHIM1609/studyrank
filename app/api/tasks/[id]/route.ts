import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { tasks } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';

// PATCH /api/tasks/[id] — update task status (toggle between 'todo' and 'done')
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  let targetStatus: 'todo' | 'done' = 'done';

  try {
    const body = await req.json();
    if (body.status === 'todo' || body.status === 'done') {
      targetStatus = body.status;
    }
  } catch {
    // default to 'done'
  }

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
      status: targetStatus,
      completedAt: targetStatus === 'done' ? new Date() : null,
    })
    .where(eq(tasks.id, id))
    .returning();

  return NextResponse.json({ task: updated });
}

// DELETE /api/tasks/[id] — delete a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // Verify ownership and delete
  const [deleted] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, id });
}
