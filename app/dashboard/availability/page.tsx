import { SubmitButton } from "@/app/components/SubmitButton";
import prisma from "@/app/lib/db";
import { times } from "@/app/lib/times";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";
import React from "react";
import { requireUser } from "@/app/lib/hooks";
import { updateAvailabilityAction } from "@/app/actions";
import { translateDayToItalian } from "@/app/lib/translateDayToItalian"
import TimeTable from "./timeTable";

async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: userId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}


const AvailabilityPage = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  // console.log(data)
  
  return (
     <TimeTable data={data} />);
};

export default AvailabilityPage;
