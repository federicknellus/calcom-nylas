import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import React from "react";
import { requireUser } from "@/app/lib/hooks";


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
