import { cancelMeetingAction } from "@/app/actions";
import { EmptyState } from "@/app/components/dashboard/EmptyState";
import { SubmitButton } from "@/app/components/SubmitButton";
import { auth } from "@/app/lib/auth";
import { nylas } from "@/app/lib/nylas";

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

async function getData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
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

  return data;
}

const MeetingsPage = async () => {
  const session = await auth();
  const data = await getData(session?.user?.id as string);
  console.log(data.data[0]);

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
            {data.data.map((item) => (
              <form key={item.id} action={cancelMeetingAction}>
                <input type="hidden" name="eventId" value={item.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}
                    </p>
                    <p className="text-muted-foreground text-xs pt-1">
                      {format(fromUnixTime(item.when.startTime), "hh:mm a")} -{" "}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>
                    <div className="flex items-center mt-1">
                    <Video
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
                      {item.conferencing?.details?.url ? "Entra nel meeting" : "Nessun link"}
                    </a>
                  </div>

                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Tu e {item.participants[0].email}
                    </p>
                  </div>
                  <SubmitButton
                    text="Cancel Event"
                    variant="destructive"
                    className="w-fit flex ml-auto"
                  />
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

{
  /* <form key={item.id} action={cancelMeetingAction}>
                <input type="hidden" name="eventId" value={item.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p>
                      {format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}
                    </p>
                    <p>
                      {format(fromUnixTime(item.when.startTime), "hh:mm a")} -{" "}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>
                    <div className="flex items-center">
                      <Video className="size-4 mr-2 text-primary" />{" "}
                      <a target="_blank" href={item.conferencing.details.url}>
                        Join Meeting
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <h2>{item.title}</h2>
                    <p>You and {item.participants[0].name}</p>
                  </div>
                  <SubmitButton
                    text="Cancel Event"
                    variant="destructive"
                    className="w-fit flex ml-auto"
                  />
                </div>
                <Separator className="my-3" />
              </form> */
}
