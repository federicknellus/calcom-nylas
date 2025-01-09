import { cancelMeetingAction } from "@/app/actions";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SubmitButton } from "@/app/components/SubmitButton";
import { auth } from "@/app/lib/auth";
import { nylas } from "@/app/lib/nylas";
import { Phone, Trash2 as Trash} from "lucide-react";

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
import { Icon, Video } from "lucide-react";
import React from "react";
import { redirect } from "next/navigation";
import { config } from "process";
export function uuidsToCompactString(uuid1, uuid2, salt = "") {
  // Function to convert UUID string to a buffer
  function uuidToBuffer(uuid) {
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
  let allBookingsWithConfig = [];
  
  for (const config of configurations) {
    const bookings = await prisma.booking.findMany({
      where: {
        configurationId: config.configurationId,
      },
      select: {
        bookingId: true,
        startTime: true,
        endTime: true,
        name: true,
        contact: true,
      },
    });
    
    const listOfBookings = bookings.map(booking => ({
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
  console.log(data.userData);
  const bookings = data.allBookingsWithConfig;
  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState
          title="No meetings found"
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
              <form key={item.id} action={cancelMeetingAction}>
                <input type="hidden" name="eventId" value={item.id} />
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
                    <Phone
                      className={`size-4 mr-2 ${
                        item.conferencing?.details?.url ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <a
                      className={`text-xs underline-offset-4 ${
                        item.conferencing?.details?.url ? "text-primary" : "text-muted-foreground cursor-not-allowed pointer-events-none"
                      }`}
                      target="_blank"
                      href={item.conferencing?.details?.url || "#"}
                    >
                      {/* {item.conferencing?.details?.url ? "Entra nel meeting" : "Nessun link"} */}
                      {item.contact}
                    </a>
                  </div>

                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {/* Tu e {item.participants[0]?.name || item.participants[0]?.email || "basta"} */}
                      {item.name}
                    </p>

                  </div>
                  <div className="flex flex-row ml-auto space-x-2">
                    <SubmitButton
                      text="Modifica Evento"
                      variant="secondary"
                      className="w-fit flex "
                      redirectUrl={`${process.env.NEXT_PUBLIC_URL}/rescheduling/${uuidsToCompactString(item.configurationId, item.bookingId)}`}
                    />
                    <SubmitButton
                      text=" "
                      icon={<Trash size={16} name="trash" />}
                      variant="destructive"
                      className="w-fit flex "

                    />
                  </div>
                </div>
                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MeetingsPage;

