import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  managingUserId: uuid("managing_user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id")
    .references(() => accounts.id)
    .notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizationUsers = pgTable(
  "organization_users",
  {
    organizationId: uuid("organization_id")
      .references(() => organizations.id)
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    role: varchar("role", { length: 20 }).notNull().$type<"admin" | "user">(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.organizationId, table.userId),
  })
);

export const calls = pgTable("calls", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id)
    .notNull(),
  phoneNumber: text("phone_number").notNull(),
  duration: text("duration").notNull(),
  storageId: text("storage_id").notNull(), // Single reference to object storage
  status: text("status").notNull(),
  startTime: timestamp("start_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);

export const insertOrganizationSchema = createInsertSchema(organizations);
export const selectOrganizationSchema = createSelectSchema(organizations);

export const insertOrganizationUserSchema =
  createInsertSchema(organizationUsers);
export const selectOrganizationUserSchema =
  createSelectSchema(organizationUsers);

export const insertCallSchema = createInsertSchema(calls);
export const selectCallSchema = createSelectSchema(calls);

// Custom Zod schemas with additional validation
export const createUserSchema = insertUserSchema.extend({
  email: z.string().email(),
  name: z.string().min(1),
});

export const createOrganizationUserSchema = insertOrganizationUserSchema.extend(
  {
    role: z.enum(["admin", "user"]),
  }
);

export const createCallSchema = insertCallSchema.extend({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  duration: z.string().min(1),
  status: z.enum(["completed", "failed", "in-progress"]),
});
