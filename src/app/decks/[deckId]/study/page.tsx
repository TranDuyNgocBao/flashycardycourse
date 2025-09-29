import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDeckById, getCardsByDeckId } from '@/db/queries';
import StudyPageClient from '@/app/decks/[deckId]/study/StudyPageClient';

interface StudyPageProps {
  params: Promise<{ deckId: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  const { deckId } = await params;
  const deckIdNum = parseInt(deckId);

  if (isNaN(deckIdNum)) {
    redirect('/dashboard');
  }

  // Get deck and validate ownership
  const deck = await getDeckById(deckIdNum, userId);
  if (!deck) {
    redirect('/dashboard');
  }

  // Get cards for the deck
  const cardsData = await getCardsByDeckId(deckIdNum, userId);
  
  if (cardsData.length === 0) {
    redirect(`/decks/${deckId}`);
  }

  // Transform cards data to include deck info
  const cards = cardsData.map(item => ({
    id: item.cards.id,
    deckId: item.cards.deckId,
    front: item.cards.front,
    back: item.cards.back,
    difficulty: item.cards.difficulty ?? 1, // Default to 1 if null
    lastReviewed: item.cards.lastReviewed,
    nextReview: item.cards.nextReview,
    reviewCount: item.cards.reviewCount ?? 0, // Default to 0 if null
    createdAt: item.cards.createdAt,
    updatedAt: item.cards.updatedAt,
    deck: {
      id: item.decks.id,
      title: item.decks.title,
      description: item.decks.description,
    }
  }));

  return (
    <StudyPageClient 
      deck={deck}
      cards={cards}
      userId={userId}
    />
  );
}
