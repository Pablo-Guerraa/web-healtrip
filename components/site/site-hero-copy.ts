export const heroCopy = {
  es: {
    headline: "Tu viaje médico,",
    headlineEnd: "en las mejores manos",
    promise: "Coordinación clara, compromiso real.",
    description: "Te acompañamos con orden y cercanía en cada paso.",
    tripAction: "Planea tu viaje",
    checkupsAction: "Ver chequeos y precios",
    patients: "Pacientes internacionales",
    countries: ["Países de", "origen"],
    checkupDuration: ["Jornada para", "tu chequeo"],
    journey: {
      label: "Así es tu viaje",
      title: "4 pasos, una sola persona contigo",
      steps: [
        {
          label: "Llegas",
          title: "Te recogemos en el aeropuerto",
          description: "Tu agente Healtrip te espera en el aeropuerto José María Córdova y te lleva a tu hospedaje.",
        },
        {
          label: "Te instalas",
          title: "Reserva tu hospedaje",
          description: "Hotel, apartamento o finca: elige dónde quedarte y llega con tu agenda confirmada.",
        },
        {
          label: "Tu chequeo",
          title: "Chequeo médico en una sola jornada",
          description: "Toma de muestras en tu hospedaje y todas tus ayudas diagnósticas el mismo día.",
        },
        {
          label: "Tu especialista",
          title: "Elige tu especialista",
          description: "Contamos con especialistas médicos para cada necesidad de salud: tú eliges y nosotros coordinamos todo.",
        },
      ],
    },
  },
  en: {
    headline: "Your medical trip,",
    headlineEnd: "in the best hands",
    promise: "Clear coordination, real commitment.",
    description: "We are with you, organized and close, every step of the way.",
    tripAction: "Plan your trip",
    checkupsAction: "See checkups and prices",
    patients: "International patients",
    countries: ["Countries of", "origin"],
    checkupDuration: ["Day for", "your checkup"],
    journey: {
      label: "How your trip works",
      title: "4 steps, one person by your side",
      steps: [
        {
          label: "You arrive",
          title: "We pick you up at the airport",
          description: "Your Healtrip agent meets you at José María Córdova airport and takes you to your stay.",
        },
        {
          label: "You settle in",
          title: "Book your stay",
          description: "Hotel, apartment or country house: choose where to stay and arrive with your schedule confirmed.",
        },
        {
          label: "Your checkup",
          title: "Full medical checkup in a single day",
          description: "Samples taken where you stay and all your diagnostic tests on the same day.",
        },
        {
          label: "Your specialist",
          title: "Choose your specialist",
          description: "We work with medical specialists for every health need: you choose, we coordinate everything.",
        },
      ],
    },
  },
} as const;

export type HeroJourneyCopy = (typeof heroCopy)[keyof typeof heroCopy]["journey"];
