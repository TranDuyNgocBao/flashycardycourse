'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { createCardAction } from '@/app/actions/card-actions';

interface AddCardModalProps {
  deckId: number;
  onCardAdded?: (newCard: any) => void;
}

export function AddCardModal({ deckId, onCardAdded }: AddCardModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    front: '',
    back: '',
    difficulty: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createCardAction({
        deckId,
        front: formData.front,
        back: formData.back,
        difficulty: formData.difficulty
      });

      if (result.success) {
        setFormData({ front: '', back: '', difficulty: 1 });
        setOpen(false);
        onCardAdded?.(result.card);
      } else {
        console.error('Failed to create card:', result.error);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Create a new flashcard for this deck. Fill in the question and answer below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front">Question / Front</Label>
            <Textarea
              id="front"
              placeholder="Enter the question or prompt..."
              value={formData.front}
              onChange={(e) => handleInputChange('front', e.target.value)}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="back">Answer / Back</Label>
            <Textarea
              id="back"
              placeholder="Enter the answer..."
              value={formData.back}
              onChange={(e) => handleInputChange('back', e.target.value)}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Input
              id="difficulty"
              type="number"
              min="1"
              max="5"
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value) || 1)}
              className="w-20"
            />
            <p className="text-xs text-muted-foreground">
              Difficulty level from 1 (easiest) to 5 (hardest)
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
