import { z } from "zod";
import { conformZodMessage } from "@conform-to/zod";

export function onboardingSchema(options?: { isUsernameUnique: () => Promise<boolean> }) {
  return z.object({
    username: z
      .string()
      .min(3, { message: "Il Nickname deve contenere almeno 3 caratteri" })
      .max(150, { message: "Il Nickname non può superare i 150 caratteri" })
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: "Il Nickname deve contenere solo lettere, numeri e -",
      })
      .pipe(
        z.string().superRefine((_, ctx) => {
          if (typeof options?.isUsernameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isUsernameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Questo Username è già in uso",
              });
            }
          });
        })
      ),
    fullName: z
      .string()
      .min(3, { message: "Almeno 3 caratteri" })
      .max(150, { message: "Non puoi superare i 150 caratteri" }),
  });
}

export const onboardingSchemaLocale = z.object({
  username: z
    .string()
    .min(3, { message: "Almeno 3 caratteri" })
    .max(150, { message: "Non puoi superare i 150 caratteri" })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Solo lettere, numeri e -",
    }),
  fullName: z
    .string()
    .min(3, { message: "Almeno 3 caratteri" })
    .max(150, { message: "Non puoi superare i 150 caratteri" }),
});

export const aboutSettingsSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Almeno 3 caratteri" })
    .max(150, { message: "Non puoi superare i 150 caratteri" }),
  profileImage: z.string().nonempty({ message: "L'immagine del profilo è obbligatoria" }),
  citta: z.string().optional(),
  indirizzo: z.string().optional(),
  nome_studio: z.string().optional(),
  telefono: z.string()
  .min(9, {message: "Sicuro che il numero sia questo?" }),
});

export const eventTypeSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Almeno 3 caratteri" })
    .max(150, { message: "Non puoi superare i 150 caratteri" }),
    sede: z
    .string()
    .min(3, { message: "Almeno 3 caratteri" })
    .max(150, { message: "Non puoi superare i 150 caratteri" }),
  duration: z
    .number()
    .min(1, { message: "La durata minima è di 1 minuto" })
    .max(100, { message: "La durata massima è di 100 minuti" }),
  url: z
    .string()
    .min(3, { message: "Almeno 3 caratteri" })
    .max(150, { message: "Non puoi superare i 150 caratteri" }),
  description: z
    .string()
    .min(3, { message: "Almeno 3 caratteri" })
    .max(150, { message: "Non puoi superare i 300 caratteri" }),
  videoCallSoftware: z
    .string()
    .nonempty({ message: "Il software per le videochiamate è obbligatorio" }),
  buffer: z.number().min(0, { message: "Il minimo tempo tra appuntamenti è 0" }),
  cancellazione: z.number().min(0, { message: "Il preavviso minimo per la cancellazione è 0" }),
  anticipo: z.number().min(0, { message: "Il minimo anticipo per la prenotazione è 0" }),

});

export function EventTypeServerSchema(options?: { 
  isUrlUnique: () => Promise<boolean>; 
  originalUrl?: string; 
}) {
  return z.object({
    url: z
      .string()
      .min(3, { message: "Almeno 3 caratteri" })
      .max(150, { message: "Non puoi superare i 150 caratteri" })
      .pipe(
        z.string().superRefine((value, ctx) => {
          if (options?.originalUrl === value) {
            // If the URL has not changed, skip the uniqueness check
            return;
          }

          if (typeof options?.isUrlUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isUrlUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Questo URL è già in uso",
              });
            }
          });
        })
      ),
    title: z
      .string()
      .min(3, { message: "Almeno 3 caratteri" })
      .max(150, { message: "Non puoi superare i 150 caratteri" }),
      sede: z
      .string()
      .min(3, { message: "Almeno 3 caratteri" })
      .max(150, { message: "Non puoi superare i 150 caratteri" }),
    duration: z
      .number()
      .min(1, { message: "La durata minima è di 1 minuto" })
      .max(100, { message: "Più di 100 non si può" }),
    description: z
      .string()
      .min(3, { message: "Almeno 3 caratteri" })
      .max(150, { message: "Non puoi superare i 150 caratteri" }),
    videoCallSoftware: z
      .string()
      .nonempty({ message: "Richiesto" }),

      buffer: z.number().min(0, { message: "Il minimo tempo tra appuntamenti è 0" }),
      cancellazione: z.number().min(0, { message: "Il preavviso minimo per la cancellazione è 0" }),
      anticipo: z.number().min(0, { message: "Il minimo anticipo per la prenotazione è 0" }),
  });
}

export const eventDetailsZod = z.object({
  name: z
    .string()
    .min(2, "Il nome deve contenere almeno 2 caratteri.")
    .max(50, "Il nome non può superare i 50 caratteri.")
    .regex(/^[\p{L}\p{M}'-]+([\s\p{L}\p{M}'-]+)*$/u, "Il nome contiene caratteri non validi."), // Supporta caratteri Unicode, accenti, spazi e apostrofi
  phone: z
    .string()
    .regex(
      /^\+?[0-9]{8,15}$/,
      "Il numero di telefono deve contenere solo cifre (con un prefisso opzionale) e avere una lunghezza tra 8 e 15 caratteri."
    ),
  email: z
    .string()
    .email("L'email inserita non è valida.")
    .optional()
    .transform((value) => value ?? "edoardogronda@zenaesis.it"), 
});


