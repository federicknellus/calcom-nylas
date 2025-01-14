import { rescheduleMeetingAction } from "@/app/actions";
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
import { CalendarCheck2 } from "lucide-react";


async function getAvailability(username: string, eventName: string) {
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
          citta: true,
          indirizzo: true,
          nome_studio: true,
          telefono: true,
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

  if (!eventType) {
    return notFound();
  }

  return eventType;
}

const Reschedule = async ({
  params,
  searchParams,
}: {
  params: { bookingId: string };
  searchParams: { date?: string; time?: string };
}) => {
  const { bookingId } = await Promise.resolve(params);

  const oldBooking = await prisma.booking.findUnique({
    where: {
      bookingId:bookingId,
    },
    select: {
      startTime: true,
      endTime: true,
      configurationId: true,
      contact: true,
      name: true,
    },
  });

  async function fetchBookingById() {
    try {
      const eventData = await prisma.eventType.findFirst({
        where: {
          configurationId: oldBooking?.configurationId,
        },
        select: {
          title: true,
          duration: true,
          url: true,
          description: true,
          userId: true,
        },
      });
      
      // const userId = eventData?.userId;

      return eventData;
    } catch (error) {
      console.error("Error fetching booking", error);
    }
  }

  const eventData = await fetchBookingById();
  if (!eventData) {
    return notFound();
  }
  async function fetchUserData() {
    try {
      const userData = await prisma.user.findUnique({
        where: {
          id: eventData?.userId,
        },
        select: {
          username: true,
          image: true,
          name: true,
        },
      });
      return userData;
    } catch (error) {
      console.error("Error fetching booking", error);
    }
  }
  const userData = await fetchUserData();
  if (!userData) {
    return notFound();}
if (userData?.username === null) {
  return notFound()}
  // console.log(userData, eventData);
  const eventType = await getAvailability(userData?.username, eventData?.url);
  // console.log("-------", eventType);
  if (!eventType) {
    return notFound();
  }
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const selectedDate = resolvedSearchParams.date
    ? new Date(resolvedSearchParams.date)
    : new Date();

  const formattedDate = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);
if (oldBooking?.startTime === undefined || oldBooking?.endTime === undefined) {
  return notFound();}
  const start = new Date(oldBooking?.startTime * 1000);
  const end = new Date(oldBooking?.endTime * 1000);
  // Options for formatting in Italian time zone
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Rome",
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  
  // Opzioni per formattare solo l'ora (ora:minuti)
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
  };
  
  // Formatta la data
  const date = new Intl.DateTimeFormat("it-IT", dateOptions).format(start);
  
  // Formatta gli orari di inizio e fine
  const startTime = new Intl.DateTimeFormat("it-IT", timeOptions).format(start);
  const endTime = new Intl.DateTimeFormat("it-IT", timeOptions).format(end);
  const showForm = !!resolvedSearchParams.date && !!resolvedSearchParams.time;
  

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
              <CardTitle 
                className=" text-primary mt-2"
               >
                {eventType.user.name}
              </CardTitle>
              <h1 className="text-xl font-semibold mt-2">Riprogrammazione</h1>
              <p className="text-sm font-medium text-muted-foreground">
              {eventType.title}
              </p>

              <div className="mt-5 grid gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {date}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventType.duration} 
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
                {eventType.user.indirizzo}, {eventType.user.citta}
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
              action={rescheduleMeetingAction}
              className="flex flex-col gap-y-4"
            >
              <input type="hidden" name="configId" value={oldBooking?.configurationId} />
              <input type="hidden" name="bookingId" value={bookingId} />
              <input
                type="hidden"
                name="fromTime"
                value={resolvedSearchParams.time}
              />
              <input
                type="hidden"
                name="eventDate"
                value={resolvedSearchParams.date}
              />
              <input
                type="hidden"
                name="meetingLength"
                value={eventType.duration}
              />
              <div className="flex flex-col gap-y-1">
                <Label>Il tuo nome</Label>
                <Input name="name" placeholder={oldBooking?.name} disabled />
              </div>

              <div className="flex flex-col gap-y-1">
                <Label>La tua email</Label>
                <Input
                  name="email"
                  placeholder={oldBooking?.contact}
                  disabled
                />
              </div>

              
              {/* <div className="flex flex-col gap-y-1">
                <Label>Il tuo numero di telefono</Label>
                <Input
                  name="phone"
                  placeholder={oldBooking?.contact}
                  disabled
                />
              </div> */}

              <div className="flex-grow"></div>
              <SubmitButton text="Ripianifica" className="self-end " />
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
              <CardTitle 
                className=" text-primary mt-2"
               >
                {eventType.user.name}
              </CardTitle>
              <h1 className="text-xl font-semibold mt-2"> Riprogrammazione</h1>
              <p className="text-sm font-medium text-muted-foreground">
              {eventData?.title}
              </p>
              <div className="mt-5 grid gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-red-800" />
                  <span className="text-sm font-medium text-muted-foreground line-through">
                    {date}, {startTime}-{endTime}
                  </span>
                </p>

                {/* <div className="grid grid-cols-3 justify-center">
                  <div className="col-span-2 flex justify-center">
                    <ArrowUpDown className="size-4 mr-2 text-muted-foreground"/>
                  </div>
                  <div>
                   
                  </div>
                </div> */}
                <p className="flex items-center">
                  <CalendarCheck2 className="size-4 mr-2 text-green-800" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {eventData?.duration} Min
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
                {eventType.user.indirizzo}, {eventType.user.citta}
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
              userName={userData?.username || "Errore nel caricare i dati"}
              meetingDuration={eventType.duration}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reschedule;
