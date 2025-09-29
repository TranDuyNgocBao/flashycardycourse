'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface StudyProgressProps {
  currentIndex: number;
  totalCards: number;
  cardsStudied: number;
  correctAnswers: number;
}

export default function StudyProgress({
  currentIndex,
  totalCards,
  cardsStudied,
  correctAnswers
}: StudyProgressProps) {
  const progressPercentage = (currentIndex / totalCards) * 100;
  const accuracy = cardsStudied > 0 ? (correctAnswers / cardsStudied) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Progress Bar */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {totalCards}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Statistics */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Cards Studied:</span>
              <Badge variant="secondary">{cardsStudied}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Accuracy:</span>
              <Badge variant={accuracy >= 70 ? "default" : accuracy >= 50 ? "secondary" : "destructive"}>
                {accuracy.toFixed(0)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
