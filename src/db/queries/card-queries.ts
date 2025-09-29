import { db } from '@/db';
import { cardsTable, decksTable } from '@/db/schema';
import { eq, and, desc, or, sql } from 'drizzle-orm';

// Get all cards for a deck (with user ownership check)
export async function getCardsByDeckId(deckId: number, userId: string) {
  return await db.select()
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(
      eq(cardsTable.deckId, deckId),
      eq(decksTable.userId, userId)
    ))
    .orderBy(desc(cardsTable.updatedAt));
}

// Get a specific card by ID (with user ownership check)
export async function getCardById(cardId: number, userId: string) {
  const [card] = await db.select()
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(
      eq(cardsTable.id, cardId),
      eq(decksTable.userId, userId)
    ));
  return card;
}

// Create a new card
export async function createCard(data: {
  deckId: number;
  front: string;
  back: string;
  difficulty?: number;
}) {
  const [newCard] = await db.insert(cardsTable).values({
    ...data,
    difficulty: data.difficulty || 1,
  }).returning();
  return newCard;
}

// Update a card
export async function updateCard(
  cardId: number, 
  userId: string, 
  data: Partial<{
    front: string;
    back: string;
    difficulty: number;
    lastReviewed: Date;
    nextReview: Date;
    reviewCount: number;
    incrementReviewCount?: boolean;
  }>
) {
  // First verify user ownership by checking if the card belongs to a deck owned by the user
  const cardWithDeck = await db.select()
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(
      eq(cardsTable.id, cardId),
      eq(decksTable.userId, userId)
    ));

  if (cardWithDeck.length === 0) {
    throw new Error('Card not found or access denied');
  }

  // Prepare update data
  const updateData: any = { ...data, updatedAt: new Date() };
  
  // If incrementReviewCount is true, increment the review count
  if (data.incrementReviewCount) {
    updateData.reviewCount = sql`${cardsTable.reviewCount} + 1`;
  }

  const [updatedCard] = await db.update(cardsTable)
    .set(updateData)
    .where(eq(cardsTable.id, cardId))
    .returning();
  return updatedCard;
}

// Delete a card
export async function deleteCard(cardId: number, userId: string) {
  // First verify user ownership by checking if the card belongs to a deck owned by the user
  const cardWithDeck = await db.select()
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(
      eq(cardsTable.id, cardId),
      eq(decksTable.userId, userId)
    ));

  if (cardWithDeck.length === 0) {
    throw new Error('Card not found or access denied');
  }

  await db.delete(cardsTable)
    .where(eq(cardsTable.id, cardId));
}

// Get cards due for review
export async function getCardsDueForReview(userId: string) {
  return await db.select()
    .from(cardsTable)
    .innerJoin(decksTable, eq(cardsTable.deckId, decksTable.id))
    .where(and(
      eq(decksTable.userId, userId),
      // Cards where nextReview is null or in the past
      or(
        eq(cardsTable.nextReview, null),
        sql`${cardsTable.nextReview} <= NOW()`
      )
    ))
    .orderBy(desc(cardsTable.updatedAt));
}
