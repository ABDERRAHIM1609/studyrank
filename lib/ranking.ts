import { db } from '@/lib/db';
import { tasks, users, dailySnapshots } from '@/drizzle/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function calculateUserDailyRanking(userId: string, date: string) {
  // Get the user's info
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return null;
  }

  // Get the user's tasks for the date
  const userTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.date, date)));

  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter((t) => t.status === 'done').length;
  const completionPct = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Compute school rank: count users in same school with higher pct today
  const schoolRankResult = await db.execute(sql`
    SELECT COUNT(DISTINCT u.id) as count
    FROM users u
    WHERE u.school = ${user.school}
      AND u.id != ${userId}
      AND EXISTS (
        SELECT 1 FROM tasks t WHERE t.user_id = u.id AND t.date = ${date}
      )
      AND (
        SELECT CAST(COUNT(CASE WHEN t2.status = 'done' THEN 1 END) AS FLOAT) / NULLIF(COUNT(t2.id), 0) * 100
        FROM tasks t2
        WHERE t2.user_id = u.id AND t2.date = ${date}
      ) > ${completionPct}
  `);
  const schoolRank = Number((schoolRankResult.rows[0] as any)?.count ?? 0) + 1;

  // Compute city rank
  const cityRankResult = await db.execute(sql`
    SELECT COUNT(DISTINCT u.id) as count
    FROM users u
    WHERE u.city = ${user.city}
      AND u.id != ${userId}
      AND EXISTS (
        SELECT 1 FROM tasks t WHERE t.user_id = u.id AND t.date = ${date}
      )
      AND (
        SELECT CAST(COUNT(CASE WHEN t2.status = 'done' THEN 1 END) AS FLOAT) / NULLIF(COUNT(t2.id), 0) * 100
        FROM tasks t2
        WHERE t2.user_id = u.id AND t2.date = ${date}
      ) > ${completionPct}
  `);
  const cityRank = Number((cityRankResult.rows[0] as any)?.count ?? 0) + 1;

  // Compute national rank
  const nationalRankResult = await db.execute(sql`
    SELECT COUNT(DISTINCT u.id) as count
    FROM users u
    WHERE u.id != ${userId}
      AND EXISTS (
        SELECT 1 FROM tasks t WHERE t.user_id = u.id AND t.date = ${date}
      )
      AND (
        SELECT CAST(COUNT(CASE WHEN t2.status = 'done' THEN 1 END) AS FLOAT) / NULLIF(COUNT(t2.id), 0) * 100
        FROM tasks t2
        WHERE t2.user_id = u.id AND t2.date = ${date}
      ) > ${completionPct}
  `);
  const nationalRank = Number((nationalRankResult.rows[0] as any)?.count ?? 0) + 1;

  // Upsert daily snapshot
  const [existingSnapshot] = await db
    .select({ id: dailySnapshots.id })
    .from(dailySnapshots)
    .where(and(eq(dailySnapshots.userId, userId), eq(dailySnapshots.date, date)))
    .limit(1);

  if (existingSnapshot) {
    await db
      .update(dailySnapshots)
      .set({
        totalTasks,
        completedTasks,
        completionPct,
        schoolRank,
        cityRank,
        nationalRank,
      })
      .where(eq(dailySnapshots.id, existingSnapshot.id));
  } else {
    await db.insert(dailySnapshots).values({
      userId,
      date,
      totalTasks,
      completedTasks,
      completionPct,
      schoolRank,
      cityRank,
      nationalRank,
    });
  }

  return {
    totalTasks,
    completedTasks,
    completionPct,
    schoolRank,
    cityRank,
    nationalRank,
  };
}
