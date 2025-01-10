'use client'

import { DeleteEventDialog } from "./DeleteEventDialog";
import { cancelMeetingAction } from "@/app/actions";

interface DeleteEventWrapperProps {
  eventId: string;
}

export function DeleteEventWrapper({ eventId }: DeleteEventWrapperProps) {
  const handleDelete = async (id: string) => {
    const formData = new FormData();
    formData.append("bookingId", id);
    await cancelMeetingAction(formData);
  };

  return <DeleteEventDialog eventId={eventId} onDelete={handleDelete} />;
}

