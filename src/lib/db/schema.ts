import type { AdapterAccount } from '@auth/core/adapters';
import { createId } from '@paralleldrive/cuid2';
import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

// NextAuth.js required tables
export const users = pgTable('User', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'Account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('Session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'VerificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// OAuth 2.1 Custom tables
export const clients = pgTable('Client', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  clientId: text('clientId')
    .unique()
    .$defaultFn(() => createId()),
  clientSecret: text('clientSecret').notNull(),
  name: text('name').notNull(),
  redirectUris: text('redirectUris').array().notNull(),
  userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const accessTokens = pgTable('AccessToken', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
  clientId: text('clientId')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const authCodes = pgTable('AuthCode', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text('code').unique().notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
  clientId: text('clientId')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  redirectUri: text('redirectUri').notNull(),
  codeChallenge: text('codeChallenge'),
  codeChallengeMethod: text('codeChallengeMethod'),
  createdAt: timestamp('createdAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Relations for better TypeScript support and joins
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  clients: many(clients),
  accessTokens: many(accessTokens),
  authCodes: many(authCodes),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  accessTokens: many(accessTokens),
  authCodes: many(authCodes),
}));

export const accessTokensRelations = relations(accessTokens, ({ one }) => ({
  client: one(clients, {
    fields: [accessTokens.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [accessTokens.userId],
    references: [users.id],
  }),
}));

export const authCodesRelations = relations(authCodes, ({ one }) => ({
  client: one(clients, {
    fields: [authCodes.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [authCodes.userId],
    references: [users.id],
  }),
}));

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type AccessToken = typeof accessTokens.$inferSelect;
export type NewAccessToken = typeof accessTokens.$inferInsert;

export type AuthCode = typeof authCodes.$inferSelect;
export type NewAuthCode = typeof authCodes.$inferInsert;
