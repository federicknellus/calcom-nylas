import { DollarSign } from "lucide-react";
import { Zap } from "lucide-react";
import { Calendar } from "lucide-react";
import { NotebookPen } from 'lucide-react';



const features = [
  {
    name: "Registrati gratuitamente",
    description:
      "Prova gratuitamente e poi decidi!",
    icon: DollarSign,
  },
  {
    name: "Incredibilmente veloce",
    description:
      "In pochi click hai già tutto pronto!",
    icon: Zap,
  },
  {
    name: "Senza pensieri",
    description:
      "Ci pensiamo noi a gestire la tua agenda!",
    icon: Calendar,
  },
  {
    name: "Basta carta e penna!",
    description:
      "Non dovrai più scrivere appuntamenti su carta e sfogliare gigantesche agende!",
    icon: NotebookPen,
  },
];

export function Features() {
  return (
    <div className="py-24 ">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary">Prenota subito!</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Prenotare in un click
        </h1>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
          Con ZenCal puoi gestire la tua agenda senza starci dietro. 
          Condividi il tuo link con i tuoi clienti e lascia che siano loro a prenotare il tuo tempo.
          Tu dovrai solo controlare la tua agenda per vedere chi è il prossimo nella lista.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <div className="text-base font-semibold leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                {feature.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
