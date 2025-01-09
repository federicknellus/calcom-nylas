import { createMeetingAction } from "@/app/actions";
import { RenderCalendar } from "@/app/components/demo/RenderCalendar";
import { SubmitButton } from "@/app/components/SubmitButton";
import { TimeSlots } from "@/app/components/TimeSlots";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/db";
import { format } from "date-fns";
import { BookMarked, CalendarX2, Clock } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
const BookingPage = async ({
    params,
    
  }: {
    params: { username: string; eventName: string };
    
  }) => {
    
    // Await the `params` before using its properties
    const resolvedParams = await Promise.resolve(params);
    const { username } = resolvedParams;
    const userData = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        image: true,
        name: true,
      },
    });
    const availabilities = await prisma.availability.findMany({
      where: {
        userId: userData?.id,
        isActive: true,
      },
    });
  
    const events = await prisma.eventType.findMany({
        where: {
            userId: userData?.id,
            active: true,
        },
        select:{
            id: true,
            title: true,
            duration: true,
            description: true,
            url: true,

        }
    }) 
  
    return (

      <div className="">
          <p className="font-bold">Dettagli Professionista</p>
        
          <p>{userData?.image}</p>
          <p>{userData?.name}</p>
          
          <p className="font-bold">Disponibilità</p>
          {availabilities.map((availability) => (
            <p key={availability.id}>{availability.day}: {availability.fromTime} - {availability.tillTime}</p>
          ))}

        <p className="font-bold">Servizi</p>

          {events.map((event) => (
            <p key={event.id}>{event.title} | {event.description} | {event.duration} | {event.url}</p>
          ))}
      </div>
    );
  };
  
  export default BookingPage;
  