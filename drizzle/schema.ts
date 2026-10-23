import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  pgEnum,
  integer,
  real,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ────────────────────────────────────────────────────────────────────
export const taskStatusEnum = pgEnum('task_status', ['todo', 'done']);

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  school: varchar('school', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull().default('Morocco'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Tasks ────────────────────────────────────────────────────────────────────
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD
  status: taskStatusEnum('status').notNull().default('todo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// ─── Daily Snapshots ──────────────────────────────────────────────────────────
export const dailySnapshots = pgTable('daily_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD
  totalTasks: integer('total_tasks').notNull().default(0),
  completedTasks: integer('completed_tasks').notNull().default(0),
  completionPct: real('completion_pct').notNull().default(0),
  schoolRank: integer('school_rank').notNull().default(1),
  cityRank: integer('city_rank').notNull().default(1),
  nationalRank: integer('national_rank').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  dailySnapshots: many(dailySnapshots),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));

export const dailySnapshotsRelations = relations(dailySnapshots, ({ one }) => ({
  user: one(users, {
    fields: [dailySnapshots.userId],
    references: [users.id],
  }),
}));

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type DailySnapshot = typeof dailySnapshots.$inferSelect;
export type NewDailySnapshot = typeof dailySnapshots.$inferInsert;
