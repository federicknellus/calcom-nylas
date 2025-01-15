'use client'

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookMarked, CalendarX2, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { cancelMeetingAction } from "@/app/actions";
import { Config } from "tailwindcss";
import { use } from "react";

export const ActionChoiceCard = ({
    image,
  configId,
  bookingId,
  title,
  userName,
  date,
    startTime,
    endTime,
    indirizzo,
    citta,
    telefono,
    duration,
}: {image:string, 
    configId:string,
    bookingId:string, 
    title:string,
    userName:string | null,
    date:string,
    startTime:string,
    endTime:string,
    indirizzo:string | null,
    citta:string | null,
    telefono:string | null,
    duration:number
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleReschedule = () => {
    const params = new URLSearchParams(searchParams);
    params.set('riprogrammare', 'true');
    router.push(`?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-[1000px] mx-auto">
      <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr] gap-4">
        <div>
          <div className="flex items-end space-x-2">
            <Image
              src={image}
              alt={`${userName}'s profile picture`}
              className="size-9 rounded-full"
              width={30}
              height={30}
            />
          </div>
          <CardTitle className="text-primary mt-2">
            {userName}
          </CardTitle>
          <h1 className="text-xl font-semibold mt-2">Gestisci Appuntamento</h1>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <div className="mt-5 grid gap-y-3">
            <p className="flex items-center">
              <CalendarX2 className="size-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {date}, {startTime}-{endTime}
              </span>
            </p>
            <p className="flex items-center">
              <Clock className="size-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {duration} Min
              </span>
            </p>
            {/* <p className="flex items-center">
              <BookMarked className="size-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {eventInformation.videoCallSoftware}
              </span>
            </p> */}
            <div className="flex-grow"></div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {indirizzo}, {citta}
              </p>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {telefono}
              </p>
            </div>
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="hidden md:block h-full w-[1px]"
        />

        <div className="flex flex-col justify-center gap-4 p-4">
          <h2 className="text-lg font-semibold text-center mb-4">
            Cosa desideri fare?
          </h2>
          <form action={cancelMeetingAction}>
            <input type="hidden" name="configId" value={configId} />
            <input type="hidden" name="bookingId" value={bookingId} />
            <div className="space-y-4">
              <Button 
                type="submit"
                variant="destructive"
                className="w-full"
              >
                Cancella
              </Button>
              <Button 
                type="button"
                variant="default"
                className="w-full"
                onClick={handleReschedule}
              >
                Riprogramma
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};