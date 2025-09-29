'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Edit, Play, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AddCardModal } from '@/components/AddCardModal';
import { EditCardModal } from '@/components/EditCardModal';
import { DeleteCardModal } from '@/components/DeleteCardModal';

interface DeckDetailClientProps {
  deck: {
    id: number;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  cards: Array<{
    cards: {
      id: number;
      front: string;
      back: string;
      difficulty: number;
      reviewCount: number;
    };
  }>;
  deckId: number;
}

export function DeckDetailClient({ deck, cards, deckId }: DeckDetailClientProps) {
  const [cardsList, setCardsList] = useState(cards);
  const [currentDeck, setCurrentDeck] = useState(deck);

  // Update cards list when props change
  useEffect(() => {
    setCardsList(cards);
  }, [cards]);

  // Update deck when props change
  useEffect(() => {
    setCurrentDeck(deck);
  }, [deck]);

  const handleCardAdded = (newCard: any) => {
    // Add the new card to the local state immediately
    setCardsList(prev => [newCard, ...prev]);
  };

  const handleDeckUpdated = (updatedDeck: { id: number; title: string; description: string | null }) => {
    // Update the local deck state immediately
    setCurrentDeck(prev => ({
      ...prev,
      title: updatedDeck.title,
      description: updatedDeck.description,
    }));
  };

  const handleCardUpdated = (updatedCard: any) => {
    // Update the card in the local state
    setCardsList(prev => 
      prev.map(card => 
        card.cards.id === updatedCard.cards.id ? updatedCard : card
      )
    );
  };

  const handleCardDeleted = (deletedCardId: number) => {
    // Remove the deleted card from the local state
    setCardsList(prev => 
      prev.filter(card => card.cards.id !== deletedCardId)
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              {deck.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Deck Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{currentDeck.title}</h1>
          {currentDeck.description && (
            <p className="text-muted-foreground">{currentDeck.description}</p>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {cardsList.length} {cardsList.length === 1 ? 'card' : 'cards'}
            </Badge>
            <Badge variant="outline">
              Created {new Date(currentDeck.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={`/decks/${deckId}/study`}>
              <Play className="h-4 w-4 mr-2" />
              Study
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Deck
          </Button>
        </div>
      </div>

      <Separator />

      {/* Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <AddCardModal deckId={deckId} onCardAdded={handleCardAdded} />
        </div>

        {cardsList.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No cards yet</h3>
                <p className="text-muted-foreground">
                  Add your first card to start studying this deck.
                </p>
                <AddCardModal deckId={deckId} onCardAdded={handleCardAdded} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cardsList.map((card) => (
              <Card key={card.cards.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">
                      {card.cards.front}
                    </CardTitle>
                    <div className="flex items-center gap-1 ml-2">
                      <EditCardModal 
                        card={card.cards} 
                        onCardUpdated={handleCardUpdated}
                      />
                      <DeleteCardModal 
                        cardId={card.cards.id}
                        cardFront={card.cards.front}
                        onCardDeleted={() => handleCardDeleted(card.cards.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-3">
                    {card.cards.back}
                  </CardDescription>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="text-xs">
                      Difficulty: {card.cards.difficulty}/5
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {card.cards.reviewCount} reviews
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
