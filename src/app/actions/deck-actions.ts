'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateDeck, deleteDeck } from '@/db/queries/deck-queries';

// Zod schema for deck update validation
const UpdateDeckSchema = z.object({
  id: z.number().int().positive('Deck ID must be a positive integer'),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
});

// TypeScript type from Zod schema
type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;

export async function updateDeckAction(input: UpdateDeckInput) {
  try {
    // Validate input with Zod
    const validatedInput = UpdateDeckSchema.parse(input);
    
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update deck through query helper
    const updatedDeck = await updateDeck(
      validatedInput.id,
      userId,
      {
        title: validatedInput.title,
        description: validatedInput.description,
      }
    );

    // Revalidate the deck page and dashboard
    revalidatePath(`/decks/${validatedInput.id}`);
    revalidatePath('/dashboard');
    
    return { success: true, deck: updatedDeck };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    console.error('Error updating deck:', error);
    return { success: false, error: 'Failed to update deck' };
  }
}

// Zod schema for deck deletion validation
const DeleteDeckSchema = z.object({
  id: z.number().int().positive('Deck ID must be a positive integer'),
});

// TypeScript type from Zod schema
type DeleteDeckInput = z.infer<typeof DeleteDeckSchema>;

export async function deleteDeckAction(input: DeleteDeckInput) {
  try {
    // Validate input with Zod
    const validatedInput = DeleteDeckSchema.parse(input);
    
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete deck through query helper
    await deleteDeck(validatedInput.id, userId);

    // Revalidate the dashboard
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    console.error('Error deleting deck:', error);
    return { success: false, error: 'Failed to delete deck' };
  }
}
