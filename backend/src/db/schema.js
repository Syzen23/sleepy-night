import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().default('Alex'),
    bedtime: text('bedtime').notNull().default('22:00'),
    theme: text('theme').notNull().default('Matcha Night'),
    voice: text('voice').notNull().default('Tessa (Momy)'),
    voiceProvider: text('voice_provider').notNull().default('Cartesia'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const sessions = pgTable('sessions', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    mood: text('mood').notNull(),
    theme: text('theme').notNull().default('coffee'),
    userTranscript: text('user_transcript').notNull(),
    aiResponse: text('ai_response').notNull(),
    summaryShared: jsonb('summary_shared').$type().notNull().default([]),
    summaryTomorrow: jsonb('summary_tomorrow').$type().notNull().default([]),
    summaryLetGo: jsonb('summary_let_go').$type().notNull().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
//# sourceMappingURL=schema.js.map