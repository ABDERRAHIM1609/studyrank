import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

// GET /api/leaderboard?scope=national|city|school&date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const session = await auth();

  const { searchParams } = new URL(req.url);
  const scope = searchParams.get('scope') || 'national';
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 });
  }

  const user = session?.user as any;

  if ((scope === 'school' || scope === 'city') && !user) {
    return NextResponse.json(
      { error: 'Please log in to view school or city rankings.', entries: [] },
      { status: 401 }
    );
  }

  let whereClause = sql`1=1`;
  if (scope === 'school' && user?.school) {
    whereClause = sql`u.school = ${user.school}`;
  } else if (scope === 'city' && user?.city) {
    whereClause = sql`u.city = ${user.city}`;
  }

  // Aggregate tasks for each user on the given date
  const result = await db.execute(sql`
    SELECT
      u.id,
      u.name,
      u.school,
      u.city,
      COUNT(t.id) AS total_tasks,
      COUNT(CASE WHEN t.status = 'done' THEN 1 END) AS completed_tasks,
      CASE
        WHEN COUNT(t.id) = 0 THEN 0
        ELSE CAST(COUNT(CASE WHEN t.status = 'done' THEN 1 END) AS FLOAT) / COUNT(t.id) * 100
      END AS completion_pct
    FROM users u
    INNER JOIN tasks t ON t.user_id = u.id AND t.date = ${date}
    WHERE ${whereClause}
    GROUP BY u.id, u.name, u.school, u.city
    HAVING COUNT(t.id) > 0
    ORDER BY completion_pct DESC, completed_tasks DESC
    LIMIT 100
  `);

  const entries = (result.rows as any[]).map((row, idx) => ({
    rank: idx + 1,
    name: row.name,
    school: row.school,
    city: row.city,
    completedTasks: Number(row.completed_tasks),
    totalTasks: Number(row.total_tasks),
    completionPct: Number(row.completion_pct),
  }));

  return NextResponse.json({ entries });
}
