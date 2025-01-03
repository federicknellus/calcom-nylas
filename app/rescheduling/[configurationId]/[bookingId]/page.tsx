
import { rescheduleMeetingAction } from "@/app/actions";
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
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { requireUser } from "@/app/lib/hooks";
import { nylas } from "@/app/lib/nylas";
// export function getData() {

//   const router = useRouter();
//   const configurationId = router.query.configurationId
//   const bookingId = router.query.bookingId

//   // const session = await requireUser();
//   // const userData = await prisma.user.findUnique({
//   //   where: {
//   //     id: session?.user?.id,
//   //   },
//   //   select: {
//   //     grantId: true,
//   //     grantEmail: true,
//   //     username: true,
//   //     image: true,
//   //     name: true,
//   //   },
//   // });

//   // const eventData = await prisma.eventType.findUnique({
//   //   where: {
//   //     id: configurationId
//   //   },
//   //   select: {
//   //     grantId: true,
//   //     grantEmail: true,
//   //     username: true,
//   //     image: true,
//   //     name: true,
//   //   },
//   // });  

//   console.log(configurationId, bookingId)

// }
// // // 
// const BookingPage = async ({
//   params,
//   searchParams,
// }: {
//   params: { username: string; eventName: string };
//   searchParams: { date?: string; time?: string };
// }) => {
  
//   // Await the `params` before using its properties
//   const resolvedParams = await Promise.resolve(params);
//   const resolvedSearchParams = await Promise.resolve(searchParams);

//   const { username, eventName } = resolvedParams;

//   const selectedDate = resolvedSearchParams.date
//     ? new Date(resolvedSearchParams.date)
//     : new Date();

//   const eventType = await getData();

//   if (!eventType) {
//     return notFound();
//   }

//   const formattedDate = new Intl.DateTimeFormat("en-US", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//   }).format(selectedDate);

//   const showForm = !!resolvedSearchParams.date && !!resolvedSearchParams.time;


//   return (
//     <div className="min-h-screen w-screen flex items-center justify-center">
//       {showForm ? (
//         <Card className="max-w-[600px]">
//           <CardContent className="p-5 grid md:grid-cols-[1fr,auto,1fr] gap-4">
//             <div>
//               <Image
//                 src={eventType.user.image as string}
//                 alt={`${eventType.user.name}'s profile picture`}
//                 className="size-9 rounded-full"
//                 width={30}
//                 height={30}
//               />
//               <p className="text-sm font-medium text-muted-foreground mt-1">
//                 {eventType.user.name}
//               </p>
//               <h1 className="text-xl font-semibold mt-2">{eventType.title}</h1>
//               <p className="text-sm font-medium text-muted-foreground">
//                 {eventType.description}
//               </p>

//               <div className="mt-5 grid gap-y-3">
//                 <p className="flex items-center">
//                   <CalendarX2 className="size-4 mr-2 text-primary" />
//                   <span className="text-sm font-medium text-muted-foreground">
//                     {formattedDate}
//                   </span>
//                 </p>
//                 <p className="flex items-center">
//                   <Clock className="size-4 mr-2 text-primary" />
//                   <span className="text-sm font-medium text-muted-foreground">
//                     {eventType.duration} Mins
//                   </span>
//                 </p>
//                 <p className="flex items-center">
//                   <BookMarked className="size-4 mr-2 text-primary" />
//                   <span className="text-sm font-medium text-muted-foreground">
//                     {eventType.videoCallSoftware}
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <Separator
//               orientation="vertical"
//               className="hidden md:block h-full w-[1px]"
//             />

//           <form
//               className="flex flex-col gap-y-4"
//               action={createMeetingAction}
//             >
//               <input type="hidden" name="eventTypeId" value={eventType.id} />
//               <input type="hidden" name="username" value={username} />
//               <input type="hidden" name="fromTime" value={resolvedSearchParams.time} />
//               <input type="hidden" name="eventDate" value={resolvedSearchParams.date} />
//               <input
//                 type="hidden"
//                 name="meetingLength"
//                 value={eventType.duration}
//               />
//               <div className="flex flex-col gap-y-1">
//                 <Label>Il tuo nome</Label>
//                 <Input name="name" placeholder="Il tuo nome" />
//               </div>

//               <div className="flex flex-col gap-y-1">
//                 <Label>La tua email</Label>
//                 <Input name="email" placeholder="mariorossi@gmail.com" />
//               </div>

//               <SubmitButton text="Prenota" />
//             </form>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card className="w-full max-w-[1000px] mx-auto">
//           <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-4">
//             <div>
//               <Image
//                 src={eventType.user.image as string}
//                 alt={`${eventType.user.name}'s profile picture`}
//                 className="size-9 rounded-full"
//                 width={30}
//                 height={30}
//               />
//               <p className="text-sm font-medium text-muted-foreground mt-1">
//                 {eventType.user.name}
//               </p>
//               <h1 className="text-xl font-semibold mt-2">{eventType.title}</h1>
//               <p className="text-sm font-medium text-muted-foreground">
//                 {eventType.description}
//               </p>
//               <div className="mt-5 grid gap-y-3">
//                 <p className="flex items-center">
//                   <CalendarX2 className="size-4 mr-2 text-primary" />
//                   <span className="text-sm font-medium text-muted-foreground">
//                     {formattedDate}
//                   </span>
//                 </p>
//                 <p className="flex items-center">
//                   <Clock className="size-4 mr-2 text-primary" />
//                   <span className="text-sm font-medium text-muted-foreground">
//                     {eventType.duration} Mins
//                   </span>
//                 </p>
//                 <p className="flex items-center">
//                   <BookMarked className="size-4 mr-2 text-primary" />
//                   <span className="text-sm font-medium text-muted-foreground">
//                     Google Meet
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <Separator
//               orientation="vertical"
//               className="hidden md:block h-full w-[1px]"
//             />

//             <div className="my-4 md:my-0">
//               <RenderCalendar daysofWeek={eventType.user.Availability} />
//             </div>

//             <Separator
//               orientation="vertical"
//               className="hidden md:block h-full w-[1px]"
//             />

//             <TimeSlots
//               selectedDate={selectedDate}
//               userName={username}
//               meetingDuration={eventType.duration}
//             />
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// // export default BookingPage;
// async function getData(eventTypeId: string) {
//   const data = await prisma.eventType.findUnique({
//     where: {
//       id: eventTypeId,
//     },
//     select: {
//       title: true,
//       description: true,
//       duration: true,
//       url: true,
//       id: true,
//       videoCallSoftware: true,
//     },
//   });

//   if (!data) {
//     return notFound();
//   }
//   return data;
// }


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
  params: { configurationId: string,bookingId: string };
  searchParams: { date?: string; time?: string };

}) => {
  const { configurationId, bookingId } = await Promise.resolve(params);
  console.log("Configuration id",configurationId,"BookingId",bookingId);
  const eventData = await prisma.eventType.findUnique({
    where: {
      configurationId: configurationId
    },
    select: {
      title: true,
      duration: true,
      url: true,
      description: true,
      userId: true,
      
    },
  });  
  console.log('Event Data',eventData)
  const userId = eventData?.userId
  
  async function fetchBookingById() {
    try {
      const booking = await nylas.scheduler.bookings.find({
        queryParams: {
          configurationId: configurationId,
        },
        bookingId: bookingId,
      });
      console.log("Booking", booking);
    } catch (error) {
      console.error("Error fetching booking", error);
    }
  }
fetchBookingById()


  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
      username: true,
      image: true,
      name: true,
    },
  });

  console.log(userData, eventData)
const eventType = await getAvailability(userData?.username, eventData?.url);
  console.log('-------',eventType)
  if (!eventType) {
    return notFound();
  }
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const selectedDate = resolvedSearchParams.date
  ? new Date(resolvedSearchParams.date)
  : new Date();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(selectedDate);
  return (
   (

    <>
    <p>{}</p>
           <Card className="w-full max-w-[1000px] mx-auto">
             <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-4">
               <div>
                 <Image
                   src={userData?.image as string}
                   alt={`${userData?.name}'s profile picture`}
                   className="size-9 rounded-full"
                   width={30}
                   height={30}
                 />
                 <p className="text-sm font-medium text-muted-foreground mt-1">
                   {userData?.name}
                 </p>
                 <h1 className="text-xl font-semibold mt-2">{eventData?.title}</h1>
                 <p className="text-sm font-medium text-muted-foreground">
                   {eventData?.description}
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
                       {eventData?.duration} Min
                     </span>
                   </p>
                   <p className="flex items-center">
                     <BookMarked className="size-4 mr-2 text-primary" />
                     <span className="text-sm font-medium text-muted-foreground">
                       Google Meet
                     </span>
                   </p>
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
                 userName={userData?.username}
                 meetingDuration={eventType.duration}
               />
             </CardContent>
           </Card>
           </>
         )
  );
};

export default Reschedule;
