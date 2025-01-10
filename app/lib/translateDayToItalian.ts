export function translateDayToItalian(day: string): string {
    const translations: { [key: string]: string } = {
      Monday: "Lunedì",
      Tuesday: "Martedì",
      Wednesday: "Mercoledì",
      Thursday: "Giovedì",
      Friday: "Venerdì",
      Saturday: "Sabato",
      Sunday: "Domenica",
    };
    return translations[day] || day; // Fallback to the original day if not found
  }