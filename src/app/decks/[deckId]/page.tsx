import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getDeckById, getCardsByDeckId } from '@/db/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, Play } from 'lucide-react';
import Link from 'next/link';
import { DeckDetailClient } from '@/components/DeckDetailClient';

interface DeckPageProps {
  params: {
    deckId: string;
  };
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  const { deckId: deckIdParam } = await params;
  const deckId = parseInt(deckIdParam);
  
  if (isNaN(deckId)) {
    notFound();
  }

  // Fetch deck and cards with user ownership verification
  const [deck, cardsData] = await Promise.all([
    getDeckById(deckId, userId),
    getCardsByDeckId(deckId, userId)
  ]);

  if (!deck) {
    notFound();
  }

  // Transform cards data to ensure non-null values
  const cards = cardsData.map(item => ({
    cards: {
      id: item.cards.id,
      front: item.cards.front,
      back: item.cards.back,
      difficulty: item.cards.difficulty ?? 1, // Default to 1 if null
      reviewCount: item.cards.reviewCount ?? 0, // Default to 0 if null
    }
  }));

  return (
    <DeckDetailClient 
      deck={deck} 
      cards={cards} 
      deckId={deckId}
    />
  );
}
