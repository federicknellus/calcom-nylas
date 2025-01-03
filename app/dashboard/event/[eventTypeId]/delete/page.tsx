import { DeleteEventTypeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const DeleteEventType = ({ params }: { params: { eventTypeId: string } }) => {
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
            <input type="hidden" name="id" value={params.eventTypeId} />
            <Button variant="destructive">Elimina</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteEventType;
