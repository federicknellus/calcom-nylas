import { DeleteEventTypeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { TriangleAlert } from 'lucide-react';

const DeleteEventType = async ({ params }: { params: Promise<{ eventTypeId: string }> }) => {
  // Await the params before using them
  const resolvedParams = await params;

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className=" flex flex-col w-[50%] h-[50%]">
        <CardHeader>
          <CardTitle 
          className="text-3xl flex flex-row items-center justify-between"
          >
            Elimina tipologia evento
            <TriangleAlert 
          className="dark:text-yellow-700 text-red-500 w-8 h-8" 
          strokeWidth={2}
          />
            </CardTitle>
          <CardDescription
          className="text-1xl"
          >
            Attenzione a cliccare Elimina
          </CardDescription>
        </CardHeader>
        <CardContent
        className="h-full flex justify-center items-center text-1xl">
          Sicuro di volerlo eliminare? Questa azione è irreversibile. Una volta eliminato questo evento tutte le prenotazioni associate verranno cancellate.
        </CardContent>
        <CardFooter className="w-full flex justify-between">
          <Button asChild variant="secondary"
          className="text-1xl">
            <Link href="/dashboard">Cancella</Link>
          </Button>
          <form action={DeleteEventTypeAction}>
            <input type="hidden" name="id" value={resolvedParams.eventTypeId} />
            <Button variant="destructive">Elimina</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteEventType;