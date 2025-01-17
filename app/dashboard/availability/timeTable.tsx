'use client'
import { SubmitButton } from "@/app/components/SubmitButton";
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
import React, {useState, useEffect} from "react";
import { updateAvailabilityAction } from "@/app/actions";
import { translateDayToItalian } from "@/app/lib/translateDayToItalian"
import { type Availability } from "@prisma/client"; // Import the type from Prisma
import { toast } from "sonner";


interface TimeTableProps {
    data: Availability[]
  }
  export function TimeTable({ data }: TimeTableProps) {
    // Track selected "from" times for each item
    const [selectedTimes, setSelectedTimes] = useState<
    Record<string, { fromTime: string; tillTime: string }>
  >({});
  
    // Helper function to filter available end times
    const getAvailableEndTimes = (fromTime: string) => {
      if (!fromTime) return times;
      
      const fromIndex = times.findIndex(t => t.time === fromTime);
      // Return all times that are at least 30 minutes after the start time
      return times.slice(fromIndex + 1);
    };

    useEffect(() => {
        const initialTimes = data.reduce((acc, item) => {
          acc[item.id] = { fromTime: item.fromTime, tillTime: item.tillTime };
          return acc;
        }, {} as Record<string, { fromTime: string; tillTime: string }>);
        setSelectedTimes(initialTimes);
      }, [data]);
  
    const handleFromTimeChange = (itemId: string, time: string) => {
        setSelectedTimes((prev) => {
            const tillTime = prev[itemId]?.tillTime || "";
            const availableEndTimes = getAvailableEndTimes(time);
            // Adjust the tillTime if it is invalid
            const newTillTime =
              tillTime && availableEndTimes.find((t) => t.time === tillTime)
                ? tillTime
                : availableEndTimes[0]?.time || "";
            return {
              ...prev,
              [itemId]: { fromTime: time, tillTime: newTillTime },
            };
          });
    };

    const handleTillTimeChange = (itemId: string, time: string) => {
        setSelectedTimes((prev) => ({
          ...prev,
          [itemId]: { ...prev[itemId], tillTime: time },
        }));
      };

      const handleSubmit = async (formData: FormData): Promise<void> => {
        try {
          const result = await updateAvailabilityAction(formData);
          if (result.status === "success") {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error("Si è verificato un errore durante l'aggiornamento.");
          console.error(error);
        }
      };
    
    return (
        <Card className="w-full">
        <CardHeader>
        <CardTitle>Disponibilità</CardTitle>
          <CardDescription>
            In questa sezione puoi impostare la tua disponibilità per i diversi giorni della settimana.
          </CardDescription>
        </CardHeader>
        <form 
        action={handleSubmit}
      >
          <CardContent className="flex flex-col gap-y-4">
            {data.map((item) => (
              <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
              key={item.id}
            >
              <input type="hidden" name={`id-${item.id}`} value={item.id} />
              <div className="flex items-center gap-x-3">
                <Switch
                  name={`isActive-${item.id}`}
                  defaultChecked={item.isActive}
                />
                <p>{translateDayToItalian(item.day)}</p>
              </div>
  
                    <Select
                      name={`fromTime-${item.id}`}
                      defaultValue={item.fromTime}
                      onValueChange={(value) => handleFromTimeChange(item.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Da" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {times.map((time) => (
                            <SelectItem key={time.time} value={time.time}>
                              {time.time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select
                      name={`tillTime-${item.id}`}
                      value={selectedTimes[item.id]?.tillTime || item.tillTime}
                      onValueChange={(value) =>
                        handleTillTimeChange(item.id, value)
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="A" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {getAvailableEndTimes(selectedTimes[item.id]?.fromTime).map((time) => (
                            <SelectItem key={time.time} value={time.time}>
                              {time.time}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
            ))}
                </CardContent>
            <CardFooter>
          <SubmitButton 
          text="Salva"
        //   testoToaster="Disponibilità cambiate con successo!"
          />
        </CardFooter>
        </form>
    </Card>
    );
  }
  
  export default TimeTable;