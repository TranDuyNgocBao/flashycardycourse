import { integer, pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const decksTable = pgTable("decks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(), // Clerk user ID
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const cardsTable = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer().notNull().references(() => decksTable.id, { onDelete: "cascade" }),
  front: text().notNull(), // The question/prompt side
  back: text().notNull(), // The answer side
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  // Optional: For spaced repetition
  difficulty: integer().default(1), // 1-5 scale
  lastReviewed: timestamp(),
  nextReview: timestamp(),
  reviewCount: integer().default(0),
});
