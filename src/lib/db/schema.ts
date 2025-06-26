import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// Import better-auth tables from CLI-generated schema
import { account, session, user, verification } from '../../../auth-schema';

// Custom OAuth 2.1 Tables
export const clients = pgTable('clients', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  clientId: text('clientId')
    .unique()
    .$defaultFn(() => createId()),
  clientSecret: text('clientSecret').notNull(),
  name: text('name').notNull(),
  redirectUris: text('redirectUris').array().notNull(),
  userId: text('userId').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const accessTokens = pgTable('accessTokens', {
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
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const authCodes = pgTable('authCodes', {
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
    .references(() => user.id, { onDelete: 'cascade' }),
  redirectUri: text('redirectUri').notNull(),
  codeChallenge: text('codeChallenge'),
  codeChallengeMethod: text('codeChallengeMethod'),
  createdAt: timestamp('createdAt', { mode: 'date' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Relations for better TypeScript support and joins
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  clients: many(clients),
  accessTokens: many(accessTokens),
  authCodes: many(authCodes),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(user, {
    fields: [clients.userId],
    references: [user.id],
  }),
  accessTokens: many(accessTokens),
  authCodes: many(authCodes),
}));

export const accessTokensRelations = relations(accessTokens, ({ one }) => ({
  client: one(clients, {
    fields: [accessTokens.clientId],
    references: [clients.id],
  }),
  user: one(user, {
    fields: [accessTokens.userId],
    references: [user.id],
  }),
}));

export const authCodesRelations = relations(authCodes, ({ one }) => ({
  client: one(clients, {
    fields: [authCodes.clientId],
    references: [clients.id],
  }),
  user: one(user, {
    fields: [authCodes.userId],
    references: [user.id],
  }),
}));

// Re-export better-auth tables for convenience
export { account, session, user, verification };

// Export types for TypeScript
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export type AccessToken = typeof accessTokens.$inferSelect;
export type NewAccessToken = typeof accessTokens.$inferInsert;

export type AuthCode = typeof authCodes.$inferSelect;
export type NewAuthCode = typeof authCodes.$inferInsert;
