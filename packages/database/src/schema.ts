import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calls = pgTable("calls", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id),
  phoneNumber: text("phone_number").notNull(),
  duration: text("duration").notNull(),
  recordingUrl: text("recording_url"),
  status: text("status").notNull(),
  startTime: timestamp("start_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertCallSchema = createInsertSchema(calls);
export const selectCallSchema = createSelectSchema(calls);

// Custom Zod schemas with additional validation
export const createUserSchema = insertUserSchema.extend({
  email: z.string().email(),
});

export const createCallSchema = insertCallSchema.extend({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  duration: z.string().min(1),
  status: z.enum(["completed", "failed", "in-progress"]),
});
