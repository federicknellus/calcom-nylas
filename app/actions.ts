"use server";

import { parseWithZod } from "@conform-to/zod";
import prisma from "./lib/db";
import { requireUser } from "./lib/hooks";
import {
  aboutSettingsSchema,
  eventTypeSchema,
  EventTypeServerSchema,
  onboardingSchema,
} from "./lib/zodSchemas";
import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";
import { nylas } from "./lib/nylas";

export async function onboardingAction(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: onboardingSchema({
      async isUsernameUnique() {
        const exisitngSubDirectory = await prisma.user.findUnique({
          where: {
            username: formData.get("username") as string,
          },
        });
        return !exisitngSubDirectory;
      },
    }),

    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const OnboardingData = await prisma.user.update({
    where: {
      id: session.user?.id,
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
          ],
        },
      },
    },
  });

  return redirect("/onboarding/grant-id");
}

export async function SettingsAction(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: aboutSettingsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const user = await prisma.user.update({
    where: {
      id: session.user?.id as string,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });

  return redirect("/dashboard");
}

export async function CreateEventTypeAction(
  prevState: any,
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
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }

  const configuration =  await nylas.scheduler.configurations.create({
    identifier: getUserData.grantId as string,
    requestBody: {
      eventBooking: {
    title: submission.value.title,
    description: submission.value.description,
    disableEmails: false,
    bookingType: 'booking',

      // when: {
      //   startTime: Math.floor(startDateTime.getTime() / 1000),
      //   endTime: Math.floor(endDateTime.getTime() / 1000),
      // },
      // conferencing: {
      //   autocreate: {},
      //   provider: submission.value.videoCallSoftware,
      // }
    },

      participants: [
        {
          name: 'Edoardo Gronda',
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
      scheduler:{
        reschedulingUrl: "http://localhost:3000/rescheduling/"+ ":booking_ref",
      },
      availability:{
        durationMinutes: submission.value.duration,
      }
    },
  });

  console.log("Configuration",configuration.data.scheduler?.reschedulingUrl);

  // console.log("General",configuration);
  // console.log("Partecipanti",configuration.data.participants)
  // console.log("Email template",configuration.data.scheduler?.emailTemplate)

  // const configurations = await nylas.scheduler.configurations.list({
  //   identifier: getUserData.grantId as string,
  // });

  // console.log("Available Configurations", configurations);

  const data = await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      userId: session.user?.id as string,
      videoCallSoftware: submission.value.videoCallSoftware,
      configurationId: configuration.data.id,
    },
  });

  return redirect("/dashboard");

}

export async function EditEventTypeAction(prevState: any, formData: FormData) {
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

  const data = await prisma.eventType.update({
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

  return redirect(`/dashboard`);
}


export async function DeleteEventTypeAction(formData: FormData) {
  const session = await requireUser();

  const data = await prisma.eventType.delete({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id as string,
    },
  });

  return redirect("/dashboard");
}

export async function updateEventTypeStatusAction(
  prevState: any,
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

    const data = await prisma.eventType.update({
      where: {
        id: eventTypeId,
        userId: session.user?.id as string,
      },
      data: {
        active: isChecked,
      },
    });

    revalidatePath(`/dashboard`);
    return {
      status: "success",
      message: "Tipo Evento aggiornato con successo",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Qualcosa è andato storto",
    };
  }
}

export async function updateAvailabilityAction(formData: FormData) {
  const session = await requireUser();

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
    return { status: "success", message: "Disponibilità modificate con successo" };
  } catch (error) {
    console.error("Errore nel modificare le disponibilità:", error);
    return { status: "error", message: "Non siamo riusciti a modificare le disponibilità" };
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

  // const session = await nylas.scheduler.sessions.create({
  //   requestBody: {
  //   configurationId: eventTypeData?.configurationId as string,
  //   timeToLive: 15
  //   }
  // })

  const formTime = formData.get("fromTime") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const eventDate = formData.get("eventDate") as string;
  const startDateTime = new Date(`${eventDate}T${formTime}:00`);
  // Calculate the end time by adding the meeting length (in minutes) to the start time
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);


  const booking = await nylas.scheduler.bookings.create({
    requestBody: {
      startTime: Math.floor(startDateTime.getTime() / 1000),
      endTime: Math.floor(endDateTime.getTime() / 1000),
      guest: 
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
        },
    },
    queryParams: {
      configurationId: eventTypeData?.configurationId as string,
    },
  });
  console.log(booking)


  const data = await prisma.booking.create({
    data: {
      name: formData.get("name") as string,
      contact: formData.get("email") as string,
      configurationId: eventTypeData?.configurationId as string,
      bookingId: booking.data.bookingId,
      startTime: Math.floor(startDateTime.getTime() / 1000),
      endTime: Math.floor(endDateTime.getTime() / 1000),
    }
  });
  // console.log('Booking salvato sul DB -------',data);

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
    throw new Error("User not found");
  }

  const data = await nylas.events.destroy({
    eventId: formData.get("eventId") as string,
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  revalidatePath("/dashboard/meetings");
}


export async function rescheduleMeetingAction(
  formData:FormData) {
  console.log('sei nel posto giusto')
  const booking_id = formData.get("bookingId") as string;
  const config_id = formData.get("configId") as string;
  const formTime = formData.get("fromTime") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const eventDate = formData.get("eventDate") as string;
  const startDateTime = new Date(`${eventDate}T${formTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

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
    prisma.booking.update({
      where: {
        bookingId: booking_id,
      },
      data: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
    });
    console.log('rescheduled booking',rescheduledBooking)
}
























