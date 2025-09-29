'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Deck {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface StudySession {
  currentCardIndex: number;
  totalCards: number;
  cardsStudied: number;
  correctAnswers: number;
  startTime: Date;
  isCompleted: boolean;
}

interface StudyCompletionProps {
  deck: Deck;
  studySession: StudySession;
  onRestart: () => void;
}

export default function StudyCompletion({
  deck,
  studySession,
  onRestart
}: StudyCompletionProps) {
  const endTime = new Date();
  const duration = Math.round((endTime.getTime() - studySession.startTime.getTime()) / 1000 / 60);
  const accuracy = studySession.cardsStudied > 0 
    ? (studySession.correctAnswers / studySession.cardsStudied) * 100 
    : 0;

  const getAccuracyLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'default' as const };
    if (accuracy >= 70) return { level: 'Good', color: 'secondary' as const };
    if (accuracy >= 50) return { level: 'Fair', color: 'secondary' as const };
    return { level: 'Needs Practice', color: 'destructive' as const };
  };

  const accuracyInfo = getAccuracyLevel(accuracy);

  const handleBackToDeck = () => {
    window.location.href = `/decks/${deck.id}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Study Session Complete! 🎉</CardTitle>
          <p className="text-muted-foreground">
            Great job studying <strong>{deck.title}</strong>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {studySession.totalCards}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Cards
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {studySession.cardsStudied}
              </div>
              <div className="text-sm text-muted-foreground">
                Cards Studied
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {studySession.correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">
                Correct Answers
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {duration}m
              </div>
              <div className="text-sm text-muted-foreground">
                Time Spent
              </div>
            </div>
          </div>

          <Separator />

          {/* Accuracy Badge */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Performance</p>
            <Badge variant={accuracyInfo.color} className="text-lg px-4 py-2">
              {accuracyInfo.level} - {accuracy.toFixed(1)}%
            </Badge>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onRestart}
              size="lg"
              className="flex-1 sm:flex-none"
            >
              Study Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleBackToDeck}
              size="lg"
              className="flex-1 sm:flex-none"
            >
              Back to Deck
            </Button>
          </div>

          {/* Motivational Message */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {accuracy >= 90 && "Outstanding work! You've mastered this deck."}
              {accuracy >= 70 && accuracy < 90 && "Great job! You're doing well with this material."}
              {accuracy >= 50 && accuracy < 70 && "Good effort! Consider reviewing the cards you found difficult."}
              {accuracy < 50 && "Keep practicing! Regular study sessions will help improve your performance."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
