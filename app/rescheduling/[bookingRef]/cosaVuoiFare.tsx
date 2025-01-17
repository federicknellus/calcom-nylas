'use client'

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/app/components/SubmitButton";
import {CalendarX2, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import {cancelMeetingActionUser } from "@/app/actions";
import { Input } from "@/components/ui/input";
import React, { useActionState } from "react";
import { toast } from "sonner";


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
    contact
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
    duration:number,
    contact:string
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialState = { error: null, success: false };
  const [state, formAction] = useActionState(cancelMeetingActionUser, initialState);

  React.useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success("Prenotazione cancellata con successo");
      router.push('/');
    }
  }, [ state]);

  const handleReschedule = () => {
    const params = new URLSearchParams(searchParams);
    params.set('riprogrammare', 'true');
    router.push(`?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-[1000px] mx-auto m-4">
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

        <div className="flex flex-col justify-center gap-2 p-4 mt-8 md:mt-0">
          <h2 className="text-lg font-semibold text-left mb-4">
            Cosa desideri fare?
          </h2>
          <form action={formAction}>
            <Input type="hidden" name="configId" value={configId} />
            <Input type="hidden" name="bookingId" value={bookingId} />
            <Input type="hidden" name="phone" value={contact} />
            <div className="flex space-y-4 space-x-4 justify-between">
            <SubmitButton text="Cancella" className="self-end bg-red-500 w-full hover:bg-red-700" />
            {/* <Separator orientation="vertical" className="h-8" /> */}
            </div>
          </form>
          <SubmitButton handleClickFunction={handleReschedule} text="Riprogramma" className="self-end w-full" />
        </div>
      </CardContent>
    </Card>
  );
};