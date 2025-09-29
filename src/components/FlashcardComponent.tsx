'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface FlashcardComponentProps {
  card: Card;
  onAnswer: (difficulty: number) => void;
  onShuffle?: () => void;
  showShuffleButton?: boolean;
}

export interface FlashcardRef {
  flip: () => void;
}

const FlashcardComponent = forwardRef<FlashcardRef, FlashcardComponentProps>(({ 
  card, 
  onAnswer, 
  onShuffle, 
  showShuffleButton = false
}, ref) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDifficultyButtons, setShowDifficultyButtons] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const flip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
      
      // Show difficulty buttons after animation completes (only if flipping to back)
      setTimeout(() => {
        if (!isFlipped) {
          setShowDifficultyButtons(true);
        } else {
          setShowDifficultyButtons(false);
        }
        setIsAnimating(false);
      }, 300);
    }
  };

  useImperativeHandle(ref, () => ({
    flip
  }));

  const handleCardClick = () => {
    flip();
  };

  const handleDifficultySelect = (difficulty: number) => {
    onAnswer(difficulty);
    // Reset for next card
    setIsFlipped(false);
    setShowDifficultyButtons(false);
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = {
      1: 'Again',
      2: 'Hard',
      3: 'Good',
      4: 'Easy',
      5: 'Perfect'
    };
    return labels[difficulty as keyof typeof labels] || 'Unknown';
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: 'destructive',
      2: 'secondary',
      3: 'default',
      4: 'secondary',
      5: 'default'
    } as const;
    return colors[difficulty as keyof typeof colors] || 'default';
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="min-h-[300px] relative group perspective-1000">
        {/* Card Header - Fixed outside flip container */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Badge variant="outline">
              Card {card.id}
            </Badge>
            {card.reviewCount > 0 && (
              <Badge variant="secondary">
                Reviewed {card.reviewCount} times
              </Badge>
            )}
          </div>
          {showShuffleButton && onShuffle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShuffle}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              🔀 Shuffle
            </Button>
          )}
        </div>

        {/* Flip Container */}
        <div 
          className={`flip-container relative w-full h-[250px] cursor-pointer transform-style-preserve-3d ${
            isFlipped ? 'flipped' : ''
          }`}
          onClick={handleCardClick}
        >
          {/* Front Face */}
          <div className="card-face card-front">
            <Card className="w-full h-full">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-muted-foreground mb-4">
                    Front - Click or press Space to flip
                  </h3>
                  <p className="text-xl leading-relaxed">
                    {card.front}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click anywhere on the card or press Space to see the answer
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back Face */}
          <div className="card-face card-back">
            <Card className="w-full h-full">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-muted-foreground mb-4">
                    Back - Click or press Space to flip back
                  </h3>
                  <p className="text-xl leading-relaxed">
                    {card.back}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click or press Space to flip back to the front
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Difficulty Buttons - Fixed outside flip container */}
        {showDifficultyButtons && (
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              How well did you know this card?
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={getDifficultyColor(difficulty)}
                  size="sm"
                  onClick={() => handleDifficultySelect(difficulty)}
                  className="text-xs"
                >
                  {difficulty}
                  <br />
                  <span className="text-xs opacity-75">
                    {getDifficultyLabel(difficulty)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

FlashcardComponent.displayName = 'FlashcardComponent';

export default FlashcardComponent;
