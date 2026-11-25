import { whatsAppHref, type SiteLocale } from "@/lib/site";
import {
  checkupPlans, formatCheckupAmount, type CheckupCurrency, type CheckupLevel, type CheckupProfile,
} from "./checkup-catalog";

export const checkupCopy = {
  es: {
    label: "Chequeos médicos",
    title: "Prevención en",
    emphasis: "una sola jornada",
    intro: "Elige tu plan y conoce tu estado de salud.",
    profile: "Perfil",
    profiles: { male: "Hombre", female: "Mujer" },
    profileTitle: { male: "Perfil hombre", female: "Perfil mujer" },
    currency: "Moneda",
    plans: "Planes",
    plan: "Plan",
    popular: "Más elegido",
    hint: "Explora los puntos del cuerpo para ver qué revisa cada examen.",
    labs: "exámenes de laboratorio",
    diagnostics: "ayudas diagnósticas",
    checkup: "Chequeo",
    samples: "Toma de muestras de laboratorio",
    examDetails: "Ver todos los exámenes",
    examDescription: "Detalle, órgano por órgano",
    reserve: "Reservar este chequeo",
    confirmation: "Confirmación y seguimiento por WhatsApp",
    next: "Siguiente paso",
    dates: "Elige tu plan y tus fechas",
    datesIntro: "Crearemos para ti una agenda médica.",
    bookDates: "Elegir fechas y reservar",
    close: "Cerrar",
    detailsTitle: "Qué incluye tu",
    detailsPlan: (name: string) => `chequeo ${name}`,
    diagnosticTitle: "Ayudas diagnósticas",
    labTitle: (count: number) => `Laboratorio · ${count} exámenes`,
    countOf: (count: number, total: number) => `${count} de ${total}`,
    allIncluded: "incluidos en todos los planes",
    includedIn: (name: string) => `incluidas en ${name}`,
    included: "Incluido",
    from: "Desde",
    approximate: "aprox.",
    request: (name: string, profile: string) => `Hola, quiero reservar el Chequeo ${name} (${profile}). ¿Cómo sigo?`,
  },
  en: {
    label: "Medical checkups",
    title: "Prevention in",
    emphasis: "a single day",
    intro: "Choose your plan and learn about your health status.",
    profile: "Profile",
    profiles: { male: "Male", female: "Female" },
    profileTitle: { male: "Male profile", female: "Female profile" },
    currency: "Currency",
    plans: "Plans",
    plan: "Plan",
    popular: "Most popular",
    hint: "Explore the points on the body to see what each test checks.",
    labs: "lab tests",
    diagnostics: "diagnostic tests",
    checkup: "Checkup",
    samples: "Laboratory sample collection",
    examDetails: "See all tests",
    examDescription: "Details, organ by organ",
    reserve: "Book this checkup",
    confirmation: "Confirmation and follow-up via WhatsApp",
    next: "Next step",
    dates: "Choose your plan and dates",
    datesIntro: "We'll create a medical itinerary for you.",
    bookDates: "Choose dates and book",
    close: "Close",
    detailsTitle: "What's included in your",
    detailsPlan: (name: string) => `${name} checkup`,
    diagnosticTitle: "Diagnostic tests",
    labTitle: (count: number) => `Lab · ${count} tests`,
    countOf: (count: number, total: number) => `${count} of ${total}`,
    allIncluded: "included in every plan",
    includedIn: (name: string) => `included in ${name}`,
    included: "Included",
    from: "From",
    approximate: "approx.",
    request: (name: string, profile: string) => `Hi, I'd like to book the ${name} checkup (${profile}). What's next?`,
  },
} as const;

export function getCheckupPrice(level: CheckupLevel, profile: CheckupProfile, currency: CheckupCurrency, locale: SiteLocale) {
  const price = checkupPlans[level].prices[profile];
  const cop = `$${formatCheckupAmount(price.COP, locale)}`;
  const usd = formatCheckupAmount(price.USD, locale);
  return {
    primary: currency === "COP" ? cop : `USD ${usd}`,
    compact: currency === "COP" ? cop : `$${usd}`,
    alternate: currency === "COP" ? `USD ${usd} ${checkupCopy[locale].approximate}` : `${cop} COP`,
    summary: currency === "COP" ? `COP · USD ${usd} ${checkupCopy[locale].approximate}` : `≈ ${cop} COP`,
  };
}

export function getCheckupBookingHref(level: CheckupLevel, profile: CheckupProfile, locale: SiteLocale) {
  const copy = checkupCopy[locale];
  return whatsAppHref(copy.request(checkupPlans[level][locale].title, copy.profiles[profile]));
}
