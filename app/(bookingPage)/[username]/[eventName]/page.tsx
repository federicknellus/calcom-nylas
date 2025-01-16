import { createMeetingAction } from "@/app/actions";
import { RenderCalendar } from "@/app/components/demo/RenderCalendar";
import { SubmitButton } from "@/app/components/SubmitButton";
import { TimeSlots } from "@/app/components/TimeSlots";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { BookMarked, CalendarX2, Clock } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

async function getData(username: string, eventName: string) {

  try {
  const eventType = await prisma.eventType.findFirst({
    where: {
      url: eventName,
      user: {
        username: username,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      user: {
        select: {
          image: true,
          name: true,
          telefono: true,
          citta: true,
          indirizzo: true,
          nome_studio: true,
          Availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });
  return eventType;
  
  } catch (e) {
    console.error(e)
    return notFound()
  }
 

  
}

type Props = {
  params: Promise<{ username: string; eventName: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const BookingPage = async ({ params, searchParams }: Props) => {
  const { username, eventName } = await params;
  const currSearchParams = await searchParams;
  const selectedDate = currSearchParams?.date
    ? new Date(currSearchParams?.date)
    : new Date();
  const eventType = await getData(username, eventName);
  console.log('####',eventType)
  if (!eventType) {
    return notFound()
  }
  
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  const showForm = !!currSearchParams?.date && !!currSearchParams?.time;
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      {showForm ? (
        <Card className="max-w-[600px]">
          <CardContent className="p-5 grid md:grid-cols-[1fr,auto,1fr] gap-4">
            <div>
              <div className="flex items-end space-x-2">
                <Image
                  src={eventType.user.image as string}
                  alt={`${eventType.user.name}'s profile picture`}
                  className="size-9 rounded-full"
                  width={30}
                  height={30}
                />
              </div>
              <CardTitle className=" text-primary mt-2">
                {eventType.user.name}
              </CardTitle>
              <h1 className="text-xl font-semibold mt-2">{eventType.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {eventType.description}
              </p>

              <div className="mt-5 grid gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventType.duration} Min
                  </span>
                </p>
                <p className="flex items-center">
                  <BookMarked className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventType.videoCallSoftware}
                  </span>
                </p>
                <div className="flex-grow"></div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mt-1">
                    {eventType.user.indirizzo
                      ? `${eventType.user.indirizzo}, ${eventType.user.citta}`
                      : eventType.user.citta}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground mt-1">
                    {eventType.user.telefono}
                  </p>
                </div>
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <form
              className="flex flex-col gap-y-4"
              action={createMeetingAction}
            >
              <input type="hidden" name="eventTypeId" value={eventType.id} />
              <input type="hidden" name="username" value={username} />
              <input
                type="hidden"
                name="fromTime"
                value={currSearchParams.time}
              />
              <input
                type="hidden"
                name="eventDate"
                value={currSearchParams.date}
              />
              <input
                type="hidden"
                name="meetingLength"
                value={eventType.duration}
              />
              <div className="flex flex-col gap-y-1">
                <Label>Il tuo nome</Label>
                <Input name="name" placeholder="Il tuo nome" />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>La tua email</Label>
                <Input name="email" placeholder="mariorossi@gmail.com" />
              </div>
              <div className="flex flex-col gap-y-1">
                <Label>Il tuo numero</Label>
                <Input name="phone" placeholder="3312523920" />
              </div>
              <div className="flex-grow"></div>
              <SubmitButton className="self-end" text="Prenota" />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-[1000px] mx-auto">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-4">
            <div>
              <div className="flex items-end space-x-2">
                <Image
                  src={eventType.user.image as string}
                  alt={`${eventType.user.name}'s profile picture`}
                  className="size-9 rounded-full"
                  width={30}
                  height={30}
                />
              </div>
              <CardTitle className=" text-primary mt-2">
                {eventType.user.name}
              </CardTitle>
              <h1 className="text-xl font-semibold mt-4">{eventType.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {eventType.description}
              </p>
              <div className="mt-5 grid grid-flow-row gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventType.duration} Min
                  </span>
                </p>
                <p className="flex items-center">
                  <BookMarked className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventType.videoCallSoftware}
                  </span>
                </p>
                <div className="flex flex-grow bg-black"></div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mt-1">
                    {eventType.user.indirizzo
                      ? `${eventType.user.indirizzo}, ${eventType.user.citta}`
                      : eventType.user.citta}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground mt-1">
                    {eventType.user.telefono}
                  </p>
                </div>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <div className="my-4 md:my-0">
              <RenderCalendar daysofWeek={eventType.user.Availability} />
            </div>

            <Separator
              orientation="vertical"
              className="hidden md:block h-full w-[1px]"
            />

            <TimeSlots
              selectedDate={selectedDate}
              userName={username}
              meetingDuration={eventType.duration}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingPage;
