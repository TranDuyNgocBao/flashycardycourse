'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import FlashcardComponent, { FlashcardRef } from '@/components/FlashcardComponent';
import StudyProgress from '@/components/StudyProgress';
import StudyCompletion from '@/components/StudyCompletion';
import { updateCardStudyData } from '@/app/actions/study-actions';

interface Card {
  id: number;
  deckId: number;
  front: string;
  back: string;
  difficulty: number;
  lastReviewed: Date | null;
  nextReview: Date | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  deck: {
    id: number;
    title: string;
    description: string | null;
  };
}

interface Deck {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface StudyPageClientProps {
  deck: Deck;
  cards: Card[];
  userId: string;
}

interface StudySession {
  currentCardIndex: number;
  totalCards: number;
  cardsStudied: number;
  correctAnswers: number;
  startTime: Date;
  isCompleted: boolean;
}

export default function StudyPageClient({ deck, cards, userId }: StudyPageClientProps) {
  const [studySession, setStudySession] = useState<StudySession>({
    currentCardIndex: 0,
    totalCards: cards.length,
    cardsStudied: 0,
    correctAnswers: 0,
    startTime: new Date(),
    isCompleted: false,
  });

  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const flashcardRef = useRef<FlashcardRef>(null);

  // Shuffle cards when component mounts
  useEffect(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setIsShuffled(true);
  }, [cards]);

  const currentCard = shuffledCards[studySession.currentCardIndex];

  // Navigation functions
  const navigateToPreviousCard = () => {
    if (studySession.currentCardIndex > 0) {
      setStudySession(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex - 1,
      }));
    }
  };

  const navigateToNextCard = () => {
    if (studySession.currentCardIndex < shuffledCards.length - 1) {
      setStudySession(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex + 1,
      }));
    }
  };

  const flipCurrentCard = () => {
    // Trigger flip using the ref
    if (flashcardRef.current) {
      flashcardRef.current.flip();
    }
  };

  const handleRestart = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setStudySession({
      currentCardIndex: 0,
      totalCards: cards.length,
      cardsStudied: 0,
      correctAnswers: 0,
      startTime: new Date(),
      isCompleted: false,
    });
  };

  const handleShuffle = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    // Reset to first card after shuffle
    setStudySession(prev => ({
      ...prev,
      currentCardIndex: 0,
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle keyboard events if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateToPreviousCard();
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateToNextCard();
          break;
        case ' ':
          event.preventDefault();
          flipCurrentCard();
          break;
        case 'Escape':
          event.preventDefault();
          window.history.back();
          break;
        case 'r':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleRestart();
          }
          break;
        case 's':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleShuffle();
          }
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [studySession.currentCardIndex, shuffledCards.length, navigateToPreviousCard, navigateToNextCard, flipCurrentCard, handleRestart, handleShuffle]);

  const handleCardAnswer = async (difficulty: number) => {
    const isCorrect = difficulty >= 3; // 3+ is considered correct
    
    // Update card study data in database
    try {
      await updateCardStudyData({
        cardId: currentCard.id,
        difficulty,
        isCorrect,
      });
    } catch (error) {
      console.error('Failed to update study data:', error);
    }
    
    setStudySession(prev => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
    }));

    // Move to next card or complete study session
    if (studySession.currentCardIndex < shuffledCards.length - 1) {
      setStudySession(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex + 1,
      }));
    } else {
      // Study session completed
      setStudySession(prev => ({
        ...prev,
        isCompleted: true,
      }));
    }
  };

  if (!isShuffled) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Preparing your study session...</h2>
            <p className="text-muted-foreground">Shuffling cards for optimal learning</p>
          </div>
        </div>
      </div>
    );
  }

  if (studySession.isCompleted) {
    return (
      <StudyCompletion
        deck={deck}
        studySession={studySession}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
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
            <BreadcrumbLink asChild>
              <Link href={`/decks/${deck.id}`} className="flex items-center gap-1">
                {deck.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">
              Study Session
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{deck.title}</h1>
            {deck.description && (
              <p className="text-muted-foreground mt-1">{deck.description}</p>
            )}
          </div>
          <Badge variant="secondary">
            Study Session
          </Badge>
        </div>
        
        {/* Keyboard Shortcuts */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background border rounded text-xs">←</kbd>
              <span>Previous card</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background border rounded text-xs">→</kbd>
              <span>Next card</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background border rounded text-xs">Space</kbd>
              <span>Flip card</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background border rounded text-xs">Esc</kbd>
              <span>Back to deck</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background border rounded text-xs">Ctrl+S</kbd>
              <span>Shuffle</span>
            </div>
          </div>
        </div>
        
        <Separator />
      </div>

      {/* Progress */}
      <StudyProgress
        currentIndex={studySession.currentCardIndex}
        totalCards={studySession.totalCards}
        cardsStudied={studySession.cardsStudied}
        correctAnswers={studySession.correctAnswers}
      />

      {/* Flashcard */}
      <div className="flex justify-center my-8">
        <FlashcardComponent
          ref={flashcardRef}
          card={currentCard}
          onAnswer={handleCardAnswer}
          onShuffle={handleShuffle}
          showShuffleButton={true}
        />
      </div>

      {/* Study Controls */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={handleShuffle}
        >
          🔀 Shuffle Cards
        </Button>
        <Button
          variant="outline"
          onClick={handleRestart}
        >
          Restart Session
        </Button>
      </div>
    </div>
  );
}
