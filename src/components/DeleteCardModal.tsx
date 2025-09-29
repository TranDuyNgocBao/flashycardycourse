'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { deleteCardAction } from '@/app/actions/card-actions';

interface DeleteCardModalProps {
  cardId: number;
  cardFront: string;
  onCardDeleted: () => void;
}

export function DeleteCardModal({ cardId, cardFront, onCardDeleted }: DeleteCardModalProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCardAction({ id: cardId });
      
      if (result.success) {
        onCardDeleted();
        setOpen(false);
      } else {
        console.error('Failed to delete card:', result.error);
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Card</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this card? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium">Card Question:</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {cardFront}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
