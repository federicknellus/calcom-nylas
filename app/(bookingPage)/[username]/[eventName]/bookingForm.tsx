"use client";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { SubmitButton } from "@/app/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMeetingAction } from "@/app/actions";
import { eventDetailsZod } from "@/app/lib/zodSchemas";
import { useActionState } from "react";

interface BookingFormProps {
  eventTypeId: string;
  username: string;
  fromTime: string | undefined;
  eventDate: string | undefined;
  meetingLength: number;
  disableButton: boolean;
}

export function BookingForm({ 
  eventTypeId, 
  username, 
  fromTime, 
  eventDate, 
  meetingLength,
  disableButton,
}: BookingFormProps) {
  console.log('disable',disableButton)
    const [form, fields] = useForm({
        id: "booking-form",
        onValidate({ formData }) {
          return parseWithZod(formData, {
            schema: eventDetailsZod
          });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
      });
    
      const [state, formAction] = useActionState(createMeetingAction, null);
  
  return (
    <form 
      id={form.id}
      className="flex flex-col gap-y-4"
      onSubmit={form.onSubmit}
      action={formAction}
    >
      <input type="hidden" name="eventTypeId" value={eventTypeId} />
      <input type="hidden" name="username" value={username} />
      <input type="hidden" name="fromTime" value={fromTime ?? ''} />
      <input type="hidden" name="eventDate" value={eventDate ?? ''} />
      <input type="hidden" name="meetingLength" value={meetingLength} />

      <div className="flex flex-col gap-y-1">
        <Label>Il tuo nome</Label>
        <Input 
          name={fields.name.name}
          placeholder="Il tuo nome"
        />
        {fields.name.errors && (
          <p className="text-sm text-red-500 mt-1">{fields.name.errors}</p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label>La tua email</Label>
        <Input 
          name={fields.email.name}
          placeholder="mariorossi@gmail.com"

        />
        {fields.email.errors && (
          <p className="text-sm text-red-500 mt-1">{fields.email.errors}</p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label>Il tuo numero</Label>
        <Input 
          name={fields.phone.name}
          placeholder="3312523920"

        />
        {fields.phone.errors && (
          <p className="text-sm text-red-500 mt-1">{fields.phone.errors}</p>
        )}
      </div>

      <div className="flex-grow"></div>
      <SubmitButton className="self-end" text="Prenota" disableButton={disableButton}/>
    </form>
  );
}