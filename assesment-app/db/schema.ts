import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const db = drizzle();

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isGuest: boolean("isGuest").$defaultFn(() => false),
  lastAssessment: integer("lastAssessment").$defaultFn(() => 0),
  createdAt: timestamp("createdAt", { mode: "date" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updatedAt", { mode: "date" }).$defaultFn(
    () => new Date()
  ),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const assessments = pgTable("assessment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  pairId: integer("pair_id"),
  value: integer("value"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "no action" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});
