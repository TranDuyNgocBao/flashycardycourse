'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createCard, updateCard, deleteCard } from '@/db/queries/card-queries';

// Zod schema for card validation
const CreateCardSchema = z.object({
  deckId: z.number().int().positive('Deck ID must be a positive integer'),
  front: z.string().min(1, 'Question is required').max(1000, 'Question too long'),
  back: z.string().min(1, 'Answer is required').max(1000, 'Answer too long'),
  difficulty: z.number().int().min(1, 'Difficulty must be at least 1').max(5, 'Difficulty must be at most 5').default(1),
});

// TypeScript type from Zod schema
type CreateCardInput = z.infer<typeof CreateCardSchema>;

export async function createCardAction(input: CreateCardInput) {
  try {
    // Validate input with Zod
    const validatedInput = CreateCardSchema.parse(input);
    
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Create card through query helper
    const newCard = await createCard({
      deckId: validatedInput.deckId,
      front: validatedInput.front,
      back: validatedInput.back,
      difficulty: validatedInput.difficulty,
    });

    // Revalidate the deck page to show the new card
    revalidatePath(`/decks/${validatedInput.deckId}`);
    
    // Return card in the format expected by the client
    return { 
      success: true, 
      card: {
        cards: {
          id: newCard.id,
          front: newCard.front,
          back: newCard.back,
          difficulty: newCard.difficulty,
          reviewCount: newCard.reviewCount || 0,
        }
      }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    console.error('Error creating card:', error);
    return { success: false, error: 'Failed to create card' };
  }
}

// Zod schema for updating card validation
const UpdateCardSchema = z.object({
  id: z.number().int().positive('Card ID must be a positive integer'),
  front: z.string().min(1, 'Question is required').max(1000, 'Question too long'),
  back: z.string().min(1, 'Answer is required').max(1000, 'Answer too long'),
  difficulty: z.number().int().min(1, 'Difficulty must be at least 1').max(5, 'Difficulty must be at most 5'),
});

// TypeScript type from Zod schema
type UpdateCardInput = z.infer<typeof UpdateCardSchema>;

export async function updateCardAction(input: UpdateCardInput) {
  try {
    // Validate input with Zod
    const validatedInput = UpdateCardSchema.parse(input);
    
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update card through query helper
    const updatedCard = await updateCard(validatedInput.id, userId, {
      front: validatedInput.front,
      back: validatedInput.back,
      difficulty: validatedInput.difficulty,
    });

    // Revalidate the deck page to show the updated card
    revalidatePath(`/decks/${updatedCard.deckId}`);
    
    // Return card in the format expected by the client
    return { 
      success: true, 
      card: {
        cards: {
          id: updatedCard.id,
          front: updatedCard.front,
          back: updatedCard.back,
          difficulty: updatedCard.difficulty,
          reviewCount: updatedCard.reviewCount || 0,
        }
      }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    console.error('Error updating card:', error);
    return { success: false, error: 'Failed to update card' };
  }
}

// Zod schema for deleting card validation
const DeleteCardSchema = z.object({
  id: z.number().int().positive('Card ID must be a positive integer'),
});

// TypeScript type from Zod schema
type DeleteCardInput = z.infer<typeof DeleteCardSchema>;

export async function deleteCardAction(input: DeleteCardInput) {
  try {
    // Validate input with Zod
    const validatedInput = DeleteCardSchema.parse(input);
    
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete card through query helper
    await deleteCard(validatedInput.id, userId);

    // Revalidate the deck page to remove the deleted card
    revalidatePath('/decks');
    
    return { 
      success: true, 
      message: 'Card deleted successfully'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    console.error('Error deleting card:', error);
    return { success: false, error: 'Failed to delete card' };
  }
}
