'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from 'lucide-react';
import { SubmitButton } from "@/app/components/SubmitButton";

interface DeleteEventDialogProps {
  eventId: string;
  onDelete: (eventId: string) => void;
}

export function DeleteEventDialog({ eventId, onDelete }: DeleteEventDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete(eventId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-fit flex">
          <Trash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            
            variant="destructive"
            className="w-fit flex"
            onClick={handleDelete}
          >Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

