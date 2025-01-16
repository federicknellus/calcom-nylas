import { cancelMeetingAction } from "@/app/actions";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { auth } from "@/app/lib/auth";
import { nylas } from "@/app/lib/nylas";
import { Phone} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/app/lib/db";
import { format, fromUnixTime } from "date-fns";
import React from "react";
import { DeleteEventWrapper } from "@/app/components/dashboard/DeleteEventWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookingsWithConfig{
  title: string;
    duration: number;
    description: string;
    configurationId: string;
    bookingId: string;
    startTime: number;
    endTime: number;
    name: string;
    contact: string;
}
export function uuidsToCompactString(uuid1:string, uuid2:string, salt = "") {
  // Function to convert UUID string to a buffer
  function uuidToBuffer(uuid:string) {
    const hex = uuid.replace(/-/g, ""); // Remove dashes
    return Buffer.from(hex, "hex");
  }

  // Convert UUID strings to buffers
  const uuidBuffer1 = uuidToBuffer(uuid1);
  const uuidBuffer2 = uuidToBuffer(uuid2);

  // Convert salt to a buffer
  const saltBuffer = Buffer.from(salt);

  // Combine buffers into one
  const combinedBuffer = Buffer.concat([uuidBuffer1, uuidBuffer2, saltBuffer]);

  // Encode to Base64 and make it URL-safe
  const compactString = combinedBuffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return compactString;
}
async function getData(userId: string) {

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
      username: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }
  const data = await nylas.events.list({
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  const configurations = await prisma.eventType.findMany({
    where: {
      userId: userId,
      active: true,
    },
    select: {
      configurationId: true,
      title: true,
      duration: true,
      description: true,
    }
  });
  
  // Create an array to store all bookings with their configurations
  let allBookingsWithConfig:BookingsWithConfig[] = [];
  
  for (const config of configurations) {
    const bookings = await prisma.booking.findMany({
      where: {
        configurationId: config.configurationId,
        isDeleted: false,
      },
      select: {
        bookingId: true,
        startTime: true,
        endTime: true,
        name: true,
        contact: true,
      },
    });
    
    const listOfBookings:BookingsWithConfig[] = bookings.map(booking => ({
      ...booking,
      ...config
    }));
    
    // Add the current configuration's bookings to the main array
    allBookingsWithConfig = [...allBookingsWithConfig, ...listOfBookings];
  }
  
  // Now allBookingsWithConfig contains all bookings with their configuration data
  
  
  return {data, userData, allBookingsWithConfig};
}


const MeetingsPage = async () => {
  const session = await auth();
  const data = await getData(session?.user?.id as string);
  const bookings = data.allBookingsWithConfig;


  return (
    <>
      {data.allBookingsWithConfig.length < 1 ? (
        <EmptyState
          title="Nessun meeting trovato"
          description="Non hai ancora nessuna prenotazione..."
          buttonText="Crea un nuovo evento"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Prenotazioni</CardTitle>
            <CardDescription>
              Le tue prenotazioni nel prossimo futuro
            </CardDescription>
          </CardHeader>
      <CardContent>
        {bookings.map((item) => (
          <div key={item.bookingId}>  {/* Changed from form to div */}
            <div className="grid grid-cols-3 justify-between items-center">
              <div>
                <p className="text-muted-foreground text-sm">
                  {format(fromUnixTime(item.startTime), "EEE, dd MMM")}
                </p>
                <p className="text-muted-foreground text-xs pt-1">
                  {format(fromUnixTime(item.startTime), "hh:mm a")} -{" "}
                  {format(fromUnixTime(item.endTime), "hh:mm a")}
                </p>
                <div className="flex items-center mt-1">
                  <Phone className="size-4 mr-2" />
                  <span className="text-muted-foreground text-xs">
                    {item.contact}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-start">
                <h2 className="text-sm font-medium">{item.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {item.name}
                </p>
              </div>
              
              <div className="flex flex-row ml-auto space-x-2">
                <Link href={`/rescheduling/${uuidsToCompactString(item.configurationId, item.bookingId)}`}>
                  <Button variant="secondary">Ripianifica</Button>
                </Link>
                <DeleteEventWrapper eventId={item.bookingId} />
              </div>
            </div>
            <Separator className="my-3" />
          </div>
        ))}
      </CardContent>
        </Card>
      )}
    </>
  );
};

export default MeetingsPage;

