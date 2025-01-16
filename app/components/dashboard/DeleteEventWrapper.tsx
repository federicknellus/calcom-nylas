'use client'

import { DeleteEventDialog } from "./DeleteEventDialog";
import { cancelMeetingAction } from "@/app/actions";
import { toast } from 'sonner'

interface DeleteEventWrapperProps {
  eventId: string;
}

export function DeleteEventWrapper({ eventId }: DeleteEventWrapperProps) {
  const handleDelete = async (id: string) => {
    const formData = new FormData();
    formData.append("bookingId", id);
    try {
      const result = await cancelMeetingAction(formData);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success('Meeting cancellato con successo');
      }
    } catch (error) {
      toast.error("Si è verificato un errore durante la cancellazione");
    }
  };

  return <DeleteEventDialog eventId={eventId} onDelete={handleDelete} />;
}

