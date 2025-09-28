import { db } from '@/db';
import { decksTable, cardsTable } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

// Get all decks for a user
export async function getUserDecks(userId: string) {
  return await db.select()
    .from(decksTable)
    .where(eq(decksTable.userId, userId))
    .orderBy(desc(decksTable.updatedAt));
}

// Get a specific deck by ID (with user ownership check)
export async function getDeckById(deckId: number, userId: string) {
  const [deck] = await db.select()
    .from(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ));
  return deck;
}

// Get user's decks with card counts
export async function getUserDecksWithCardCount(userId: string) {
  return await db
    .select({
      id: decksTable.id,
      title: decksTable.title,
      description: decksTable.description,
      createdAt: decksTable.createdAt,
      cardCount: sql<number>`count(${cardsTable.id})`,
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
    .where(eq(decksTable.userId, userId))
    .groupBy(decksTable.id, decksTable.title, decksTable.description, decksTable.createdAt);
}

// Create a new deck
export async function createDeck(data: {
  userId: string;
  title: string;
  description?: string;
}) {
  const [newDeck] = await db.insert(decksTable).values(data).returning();
  return newDeck;
}

// Update a deck
export async function updateDeck(
  deckId: number, 
  userId: string, 
  data: Partial<{ title: string; description: string }>
) {
  const [updatedDeck] = await db.update(decksTable)
    .set({ ...data, updatedAt: new Date() })
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ))
    .returning();
  return updatedDeck;
}

// Delete a deck
export async function deleteDeck(deckId: number, userId: string) {
  await db.delete(decksTable)
    .where(and(
      eq(decksTable.id, deckId),
      eq(decksTable.userId, userId)
    ));
}
