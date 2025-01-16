"use server";

import { parseWithZod } from "@conform-to/zod";
import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import {
  aboutSettingsSchema,
  EventTypeServerSchema,
  onboardingSchema,
} from "./lib/zodSchemas";
import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";
import { nylas } from "./lib/nylas";
import { Availability, ConfigParticipant, EventBooking, SchedulerSettings } from "nylas";
import { exec } from "child_process";
interface Configuration {
  data: {
  participants: ConfigParticipant[];
  availability: Availability;
  eventBooking: EventBooking;
  slug?: string;
  requiresSessionAuth?: boolean;
  scheduler?: SchedulerSettings;
  appearance?: Record<string, string>;
  id?: string;}
}


// Update the action function with proper types
export async function onboardingAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await requireUser();
  
  if (!session.user?.id) {
    throw new Error('User not authenticated');
  }

  const submission = await parseWithZod(formData, {
    schema: onboardingSchema({
      async isUsernameUnique() {
        const existingSubDirectory = await prisma.user.findUnique({
          where: {
            username: formData.get("username") as string,
          },
        });
        return !existingSubDirectory;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const onboardingData = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      username: submission.value.username,
      name: submission.value.fullName,
      Availability: {
        createMany: {
          data: [
            {
              day: "Monday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Tuesday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Wednesday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Thursday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Friday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Saturday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Sunday",
              fromTime: "08:00",
              tillTime: "18:00",
            },
          ] ,
        },
      },
    },
  });

  console.log('Onboarding Data:', onboardingData);

  return redirect("/onboarding/grant-id");
}
export async function SettingsAction(_prevState:unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: aboutSettingsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const userUpdated = await prisma.user.update({
    where: {
      id: session.user?.id as string,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
      citta: submission.value.citta,
      indirizzo: submission.value.indirizzo,
      nome_studio: submission.value.nome_studio,
      telefono: submission.value.telefono,
    },
  });

  console.log('User Updated:', userUpdated);

  return redirect("/dashboard");
}

export async function CreateEventTypeAction(
  _prevState: unknown,
  formData: FormData
) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: EventTypeServerSchema({
      async isUrlUnique() {
        const data = await prisma.eventType.findFirst({
          where: {
            userId: session.user?.id,
            url: formData.get("url") as string,
          },
        });
        return !data;
      },
    }),

    async: true,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const getUserData = await prisma.user.findUnique({
    where: {
      id: session.user?.id as string,
    },
    select: {
      name: true,
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }
  
  const newConfiguration = (await nylas.scheduler.configurations.create({
    identifier: getUserData.grantId as string,
    requestBody: {
      eventBooking: {
        title: submission.value.title,
        description: submission.value.description,
        disableEmails: true,
        bookingType: "booking",
      },

      participants: [
        {
          name: getUserData.name!,
          email: getUserData.grantEmail!,
          availability: {
            calendarIds: [getUserData.grantEmail!],
          },
          booking: {
            calendarId: getUserData.grantEmail!,
          },
          isOrganizer: true,
        },
      ],
      scheduler: {
        reschedulingUrl: process.env.RESCHEDULING_URL + ":booking_ref",
      },
      availability: {
        durationMinutes: submission.value.duration,
      },
    },
  })) as Configuration;

  console.log('Created New Configuration:', newConfiguration);


  const newEventType = await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      userId: session.user?.id as string,
      videoCallSoftware: submission.value.videoCallSoftware,
      configurationId: newConfiguration.data.id as string,
    },
  });

  console.log('Created New Event Type:', newEventType);

  return redirect("/dashboard");
}

export async function EditEventTypeAction(_prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const originalUrl = formData.get("originalUrl") as string;

  const submission = await parseWithZod(formData, {
    schema: EventTypeServerSchema({
      async isUrlUnique() {
        const data = await prisma.eventType.findFirst({
          where: {
            userId: session.user?.id,
            url: formData.get("url") as string,
          },
        });
        return !data;
      },
      originalUrl,
    }),

    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const updatedEvent = await prisma.eventType.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id as string,
    },
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.videoCallSoftware,
    },
  });

  console.log('Updated Event:', updatedEvent);

  return redirect(`/dashboard`);
}

export async function DeleteEventTypeAction(formData: FormData) {
  const session = await requireUser();

  const deletedEvent = await prisma.eventType.delete({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id as string,
    },
  });

  console.log('Deleted Event:', deletedEvent);

  return redirect("/dashboard");
}

export async function updateEventTypeStatusAction(
  _prevState: unknown,
  {
    eventTypeId,
    isChecked,
  }: {
    eventTypeId: string;
    isChecked: boolean;
  }
) {
  try {
    const session = await requireUser();

    const updatedEvent = await prisma.eventType.update({
      where: {
        id: eventTypeId,
        userId: session.user?.id as string,
      },
      data: {
        active: isChecked,
      },
    });
    console.log('Updated Event Status:', updatedEvent);
    revalidatePath(`/dashboard`);
    return {
      status: "success",
      message: "Tipo Evento aggiornato con successo",
    };
  } catch (error) {
    console.log("Errore nell'aggiornare il tipo evento:", error);
    return {
      status: "error",
      message: "Qualcosa è andato storto",
    };
  }
}

export async function updateAvailabilityAction(formData: FormData):Promise<void> {
  const session = await requireUser();

  if (!session.user) {
    throw new Error("Utente non trovato");
  }

  const rawData = Object.fromEntries(formData.entries());
  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => {
      const id = key.replace("id-", "");
      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on",
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      };
    });

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath("/dashboard/availability");
    // return {
    //   status: "success",
    //   message: "Disponibilità modificate con successo",
    // };
  } catch (error) {
    console.error("Errore nel modificare le disponibilità:", error);
    // return {
    //   status: "error",
    //   message: "Non siamo riusciti a modificare le disponibilità",
    // };
  }
}

export async function createMeetingAction(formData: FormData) {
  const getUserData = await prisma.user.findUnique({
    where: {
      username: formData.get("username") as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
      name: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }

  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get("eventTypeId") as string,
    },
    select: {
      title: true,
      description: true,
      configurationId: true,
    },
  });


  const formTime = formData.get("fromTime") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const eventDate = formData.get("eventDate") as string;
  const startDateTime = new Date(`${eventDate}T${formTime}:00`);
  
  // Calculate the end time by adding the meeting length (in minutes) to the start time
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  const timeFormatter = new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedStartTime = timeFormatter.format(startDateTime); // "08:00"

  // Risultato: "8 gennaio 2025 dalle 08:00 alle 08:45"
  const data_whatsapp = `${startDateTime.getDate()} ${startDateTime.toLocaleString(
    "it-IT",
    { month: "long" }
  )} ${startDateTime.getFullYear()}`;
  const ora_whatsapp = `${formattedStartTime}`;
  let booking = null;
  try{
   booking = await nylas.scheduler.bookings.create({
    requestBody: {
      startTime: Math.floor(startDateTime.getTime() / 1000),
      endTime: Math.floor(endDateTime.getTime() / 1000),
      guest: {
        name: formData.get("name") as string,
        email: formData.get("email") as string, //TODO qui harcodiamo la nostra?
      },
    },
    queryParams: {
      configurationId: eventTypeData?.configurationId as string,
    },
  });
} catch (error) {
  console.error("Errore durante la creazione della prenotazione:", error);
}
  if (!booking) {
    return redirect("/dashboard");}
    
  console.log('Booking Booked on Nylas:', booking);

  const bookingSupabase = await prisma.booking.create({
    data: {
      name: formData.get("name") as string,
      contact: formData.get("phone") as string,
      configurationId: eventTypeData?.configurationId as string,
      bookingId: booking.data.bookingId,
      startTime: Math.floor(startDateTime.getTime() / 1000),
      endTime: Math.floor(endDateTime.getTime() / 1000),
    },
  });

  console.log('Booking Booked on Supabase:', bookingSupabase);

  // const sendWhatsAppBookingCreation = async () => {
  //   const url = `https://graph.facebook.com/v21.0/${process.env.NUMERO_WHATSAPP}/messages`;

  //   const data = {
  //     messaging_product: "whatsapp",
  //     to: "39" + (formData.get("phone") as string),
  //     type: "template",
  //     template: {
  //       name: "event_details_reminder_2",
  //       language: {
  //         code: "en_US",
  //       },
  //       components: [
  //         {
  //           type: "body",
  //           parameters: [
  //             {
  //               type: "text",
  //               text: eventTypeData?.title,
  //             },
  //             {
  //               type: "text",
  //               text: getUserData?.name,
  //             },
  //             {
  //               type: "text",
  //               text: data_whatsapp,
  //             },
  //             {
  //               type: "text",
  //               text: ora_whatsapp,
  //             },//TODO aggiungere il campo per il luogo e per il link di rescheduling e cancellation
  //           ],
  //         },
  //       ],
  //     },
  //   };

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();
  //     console.log("Messaggio di prenotazione inviato con successo:", result);
  //   } catch (error) {
  //     console.error("Errore nell'inviare il messaggio di prenotazione:", error);
  //   }
  // };

  // sendWhatsAppBookingCreation();

  return redirect(`/success`);
}

export async function cancelMeetingAction(formData: FormData) {
  const session = await requireUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user?.id as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!userData) {
    throw new Error("Utente non trovato"); // Caso in cui l'utente non è trovato nel database
  }

  const booking = await prisma.booking.findUnique({
    where: {
      bookingId: formData.get("bookingId") as string,
    },
    select: {
      configurationId: true,
    },
  });
  console.log("ID", formData.get("bookingId") as string);
  console.log("config", booking?.configurationId);
  const bookingFound = await nylas.scheduler.bookings.find({
    bookingId: formData.get("bookingId") as string,
    queryParams: {
      configurationId: booking?.configurationId as string,
    },
  });
  
  console.log("Trovato il booking:", bookingFound);
  
  //TODO qua abbiamo usato questo excamotage perche al momento non abbiamo un metodo per cancellare un booking via api
  const data = await nylas.events.destroy({
    eventId: bookingFound.data.eventId,
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
      notifyParticipants: false,
    },
  });
  if (data) {
    await prisma.booking.update({
      where: {
        bookingId: formData.get("bookingId") as string,
      },
      data: {
        isDeleted: true,
      },
    });
  }


  revalidatePath("/dashboard/meetings");
}

export async function rescheduleMeetingAction(formData: FormData) {
  const booking_id = formData.get("bookingId") as string;
  const config_id = formData.get("configId") as string;
  const formTime = formData.get("fromTime") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const eventDate = formData.get("eventDate") as string;
  const startDateTime = new Date(`${eventDate}T${formTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  console.log(startDateTime);
  console.log("times", Math.floor(startDateTime.getTime() / 1000));

  try {
    const rescheduledBooking = await nylas.scheduler.bookings.reschedule({
      queryParams: {
        configurationId: config_id,
      },
      bookingId: booking_id,
      requestBody: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
    });

    if (!rescheduledBooking) {
      throw new Error("Errore durante la riprogrammazione della prenotazione"); // Caso in cui la riprogrammazione fallisce
    }

    const rescheduledPrisma = await prisma.booking.update({
      where: {
        bookingId: booking_id,
      },
      data: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
        updatedAt: new Date(),
      },
    });

    if (!rescheduledPrisma) {
      throw new Error(
        "Errore durante l'aggiornamento della prenotazione nel database"
      ); // Caso in cui il database non si aggiorna
    }

    console.log("rescheduled booking", rescheduledBooking);
    console.log("rescheduled booking", rescheduledPrisma);
  } catch (error) {
    console.error("Errore durante la riprogrammazione della riunione:", error);
    throw new Error(
      "Si è verificato un errore durante la riprogrammazione della riunione"
    ); // Errore generico
  }

  return redirect(`/success`);
}
