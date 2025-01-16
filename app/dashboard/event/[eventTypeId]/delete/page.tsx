import { DeleteEventTypeAction } from "@/app/actions";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
type Props = {
  params: Promise<{ eventTypeId: string}>
}
const DeleteEventType = async({ params }: Props) => {
  const { eventTypeId } = await params;
  const eventType = await prisma.eventType.findFirst({
    where: {
      id: eventTypeId,
    },
  })
  if (!eventType) {
    return notFound()
  }
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Elimina tipologia evento</CardTitle>
          <CardDescription>
            Sicuro di volerlo eliminare? Questa azione è irreversibile.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button asChild variant="secondary">
            <Link href="/dashboard">Cancella</Link>
          </Button>
          <form action={DeleteEventTypeAction}>
            <input type="hidden" name="id" value={eventTypeId} />
            <Button variant="destructive">Elimina</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteEventType;
