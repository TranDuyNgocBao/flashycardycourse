'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateCard } from '@/db/queries/card-queries';

// Zod schema for study session update
const StudyUpdateSchema = z.object({
  cardId: z.number().int().positive(),
  difficulty: z.number().int().min(1).max(5),
  isCorrect: z.boolean(),
});

type StudyUpdateInput = z.infer<typeof StudyUpdateSchema>;

export async function updateCardStudyData(input: StudyUpdateInput) {
  try {
    // Validate input with Zod
    const validatedInput = StudyUpdateSchema.parse(input);
    
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Calculate next review time based on difficulty (spaced repetition)
    const now = new Date();
    const nextReview = calculateNextReview(validatedInput.difficulty, now);

    // Update card with study data
    const updatedCard = await updateCard(validatedInput.cardId, userId, {
      difficulty: validatedInput.difficulty,
      lastReviewed: now,
      nextReview: nextReview,
      incrementReviewCount: true,
    });

    revalidatePath('/decks');
    return { success: true, card: updatedCard };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    console.error('Study update error:', error);
    return { success: false, error: 'Failed to update study data' };
  }
}

// Calculate next review time based on difficulty and spaced repetition algorithm
function calculateNextReview(difficulty: number, lastReviewed: Date): Date {
  const intervals = {
    1: 1,      // Again - 1 minute
    2: 6,      // Hard - 6 minutes  
    3: 10,     // Good - 10 minutes
    4: 4 * 60, // Easy - 4 hours
    5: 24 * 60, // Perfect - 1 day
  };

  const intervalMinutes = intervals[difficulty as keyof typeof intervals] || 10;
  const nextReview = new Date(lastReviewed.getTime() + intervalMinutes * 60 * 1000);
  
  return nextReview;
}

// Batch update multiple cards after study session
const BatchStudyUpdateSchema = z.object({
  updates: z.array(z.object({
    cardId: z.number().int().positive(),
    difficulty: z.number().int().min(1).max(5),
    isCorrect: z.boolean(),
  }))
});

type BatchStudyUpdateInput = z.infer<typeof BatchStudyUpdateSchema>;

export async function batchUpdateStudyData(input: BatchStudyUpdateInput) {
  try {
    const validatedInput = BatchStudyUpdateSchema.parse(input);
    
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const results = [];
    const now = new Date();

    // Update each card
    for (const update of validatedInput.updates) {
      const nextReview = calculateNextReview(update.difficulty, now);
      
      const result = await updateCard(update.cardId, userId, {
        difficulty: update.difficulty,
        lastReviewed: now,
        nextReview: nextReview,
        incrementReviewCount: true,
      });
      
      results.push(result);
    }

    revalidatePath('/decks');
    return { success: true, results };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    console.error('Batch study update error:', error);
    return { success: false, error: 'Failed to update study data' };
  }
}
