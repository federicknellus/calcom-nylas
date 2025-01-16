'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from 'lucide-react';

interface DeleteEventDialogProps {
  eventId: string;
  onDelete: (eventId: string) => void;
}

export function DeleteEventDialog({ eventId, onDelete }: DeleteEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(eventId);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-fit flex">
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conferma Cancellazione</DialogTitle>
          <DialogDescription>
            Sei sicuro di voler cancellare questo evento? Questa azione è irreversibile.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={isDeleting}>Annulla</Button>
          <Button
            
            variant="destructive"
            className="w-fit flex"
            onClick={handleDelete}
          >Conferma</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

