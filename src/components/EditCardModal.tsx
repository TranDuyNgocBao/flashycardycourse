'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit } from 'lucide-react';
import { updateCardAction } from '@/app/actions/card-actions';

interface EditCardModalProps {
  card: {
    id: number;
    front: string;
    back: string;
    difficulty: number;
  };
  onCardUpdated: (updatedCard: any) => void;
}

export function EditCardModal({ card, onCardUpdated }: EditCardModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    front: card.front,
    back: card.back,
    difficulty: card.difficulty,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateCardAction({
        id: card.id,
        front: formData.front,
        back: formData.back,
        difficulty: formData.difficulty,
      });

      if (result.success) {
        onCardUpdated(result.card);
        setOpen(false);
        // Reset form to original values
        setFormData({
          front: card.front,
          back: card.back,
          difficulty: card.difficulty,
        });
      } else {
        console.error('Failed to update card:', result.error);
      }
    } catch (error) {
      console.error('Error updating card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setFormData({
        front: card.front,
        back: card.back,
        difficulty: card.difficulty,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>
            Make changes to your flashcard here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front">Question</Label>
              <Textarea
                id="front"
                value={formData.front}
                onChange={(e) => setFormData(prev => ({ ...prev, front: e.target.value }))}
                placeholder="Enter the question or prompt..."
                className="min-h-[80px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="back">Answer</Label>
              <Textarea
                id="back"
                value={formData.back}
                onChange={(e) => setFormData(prev => ({ ...prev, back: e.target.value }))}
                placeholder="Enter the answer..."
                className="min-h-[80px]"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty (1-5)</Label>
              <Input
                id="difficulty"
                type="number"
                min="1"
                max="5"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
