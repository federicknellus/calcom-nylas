import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock } from 'lucide-react'
import Link from "next/link"
import prisma from "@/lib/db";
import React from "react";
import { translateDayToItalian } from "@/app/lib/translateDayToItalian"

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
      <div className="min-h-screen p-4 md:p-4 bg-transparent border-transparent shadow-none">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Professional Details */}
          <Card className="bg-transparent border-transparent shadow-none">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userData?.image || ''} alt={userData?.name || 'Professional'} />
                  <AvatarFallback>{userData?.name?.[0] || 'P'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold text-primary">
                    {userData?.name}
                  </CardTitle>
                  <p className="text-muted-foreground">I miei servizi</p>
                </div>
              </div>
            </CardHeader>
          </Card>
  
          <Card className="bg-transparent border-transparent shadow-none">
            <Separator />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Quando ci sono
              </CardTitle>
              <CardDescription>Controlla in fondo alla pagina le mie disponibilità rispetto ai servizi specifici</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 ">
                {availabilities.map((availability) => (
                  <div
                    key={availability.id}
                    className="flex items-center justify-between rounded-md hover:bg-accent transition-colors p-1"
                  >
                    <span className="font-medium">{translateDayToItalian(availability.day)}</span>
                    <span className="text-muted-foreground">
                      {availability.fromTime} - {availability.tillTime}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
  
          {/* Services */}
          <Card className="bg-transparent border-transparent shadow-none">
            <Separator />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                I servizi disponibili
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/${username}/${event.url}`}
                    className="block"
                  >
                    <div className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-muted-foreground mt-1">{event.description}</p>
                        </div>
                        <span className="text-primary font-medium">
                          {event.duration} min
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  
  
  export default BookingPage;
  