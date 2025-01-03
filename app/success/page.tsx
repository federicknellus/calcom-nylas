"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="max-w-[400px] w-full mx-auto">
        <CardContent className="p-6 flex flex-col w-full items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-semibold mt-4">
            Evento prenotato con successo
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Abbiamo inviato una mail di recap a te e il tuo professionista. 
            In caso di problemi, modifica l'impegno o contatta il tuo professionista.
          </p>

          {/*     <Separator className="my-5" />

          <div className="grid grid-cols-3 w-full  self-start gap-y-4">
            <div className="col-span-1">
              <h1 className="font-medium">What</h1>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Design Workshop</p>
            </div>

            <div className="col-span-1">
              <h1 className="font-medium">When</h1>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">10:00 - 12:00</p>
            </div>
            <div className="col-span-1">
              <h1 className="font-medium">Where</h1>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Online</p>
            </div>
          </div> */}
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/">Termina</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
