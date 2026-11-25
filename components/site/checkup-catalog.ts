import type { SiteLocale } from "@/lib/site";

// Catalog and pricing from the current Healtrip WordPress home pages.
export const checkupLevels = [0, 1, 2] as const;
export type CheckupLevel = (typeof checkupLevels)[number];
export type CheckupProfile = "male" | "female";
export type CheckupCurrency = "COP" | "USD";

export const checkupPlans = [
  {
    id: "basico",
    prices: {
      male: { COP: 1190000, USD: 340 },
      female: { COP: 1280000, USD: 370 },
    },
    es: {
      title: "Básico",
      short: "Básico",
      caption: "Evaluación preventiva",
      description: "Evaluación general y preventiva de tu estado de salud.",
      services: ["Toma de muestras en tu hotel o apartamento", "Consulta con médico internista"],
    },
    en: {
      title: "Basic",
      short: "Basic",
      caption: "Preventive evaluation",
      description: "A general, preventive evaluation of your health.",
      services: ["Sample collection at your hotel or apartment", "Consultation with an internist"],
    },
  },
  {
    id: "avanzado",
    prices: {
      male: { COP: 1420000, USD: 400 },
      female: { COP: 1455000, USD: 420 },
    },
    es: {
      title: "Avanzado",
      short: "Avanzado",
      caption: "Con ayudas diagnósticas",
      description: "Evaluación completa con ayudas diagnósticas.",
      services: [],
    },
    en: {
      title: "Advanced",
      short: "Advanced",
      caption: "With diagnostic tests",
      description: "A complete evaluation with diagnostic tests.",
      services: [],
    },
  },
  {
    id: "premium",
    prices: {
      male: { COP: 1780000, USD: 510 },
      female: { COP: 1850000, USD: 530 },
    },
    es: {
      title: "Ejecutivo Premium",
      short: "Premium",
      caption: "El más completo",
      description: "El más completo, diseñado para tu agenda.",
      services: [],
    },
    en: {
      title: "Executive Premium",
      short: "Premium",
      caption: "The most complete",
      description: "The most complete, designed around your schedule.",
      services: [],
    },
  },
] as const;

export type CheckupArea = "thyroid" | "blood" | "lungs" | "breast" | "heart" | "liver" | "kidney" | "gut" | "pelvis";
export type CheckupExamType = "lab" | "diagnostic";

type ExamCopy = { title: string; description: string; category: string };

export type CheckupExam = {
  id: string;
  area: CheckupArea;
  level: CheckupLevel;
  profile: CheckupProfile | "all";
  type: CheckupExamType;
  es: ExamCopy;
  en: ExamCopy;
};

export const checkupExams: readonly CheckupExam[] = [
  {
    id: "lipid-profile",
    area: "heart", level: 0, profile: "all", type: "lab",
    es: { title: "Perfil lipídico", description: "Colesterol y triglicéridos", category: "Corazón" },
    en: { title: "Lipid profile", description: "Cholesterol and triglycerides", category: "Heart" },
  },
  {
    id: "creatinine",
    area: "kidney", level: 0, profile: "all", type: "lab",
    es: { title: "Creatinina", description: "Cómo trabajan tus riñones", category: "Riñón" },
    en: { title: "Creatinine", description: "How your kidneys are working", category: "Kidney" },
  },
  {
    id: "hba1c",
    area: "blood", level: 0, profile: "all", type: "lab",
    es: { title: "Hemoglobina glicosilada", description: "Tu azúcar promedio de 3 meses", category: "Metabolismo" },
    en: { title: "Glycated hemoglobin (HbA1c)", description: "Your average blood sugar over 3 months", category: "Metabolism" },
  },
  {
    id: "liver-enzymes",
    area: "liver", level: 0, profile: "all", type: "lab",
    es: { title: "Transaminasas TGO y TGP", description: "Salud de tu hígado", category: "Hígado" },
    en: { title: "Liver enzymes AST and ALT", description: "Your liver health", category: "Liver" },
  },
  {
    id: "blood-count",
    area: "blood", level: 0, profile: "all", type: "lab",
    es: { title: "Hemograma y sedimentación", description: "Células de la sangre e inflamación", category: "Sangre" },
    en: { title: "Complete blood count and ESR", description: "Blood cells and inflammation", category: "Blood" },
  },
  {
    id: "tsh",
    area: "thyroid", level: 0, profile: "all", type: "lab",
    es: { title: "TSH", description: "Función de tu tiroides", category: "Tiroides" },
    en: { title: "TSH", description: "How your thyroid is working", category: "Thyroid" },
  },
  {
    id: "psa",
    area: "pelvis", level: 0, profile: "male", type: "lab",
    es: { title: "Antígeno prostático", description: "Salud de la próstata", category: "Próstata" },
    en: { title: "Prostate-specific antigen (PSA)", description: "Prostate health", category: "Prostate" },
  },
  {
    id: "pap-test",
    area: "pelvis", level: 0, profile: "female", type: "lab",
    es: { title: "Citología en base líquida", description: "Salud del cuello uterino", category: "Ginecología" },
    en: { title: "Liquid-based cytology (Pap test)", description: "Cervical health", category: "Gynecology" },
  },
  {
    id: "urinalysis",
    area: "kidney", level: 0, profile: "all", type: "lab",
    es: { title: "Uroanálisis", description: "Riñones y vías urinarias", category: "Orina" },
    en: { title: "Urinalysis", description: "Kidneys and urinary tract", category: "Urine" },
  },
  {
    id: "fecal-occult-blood",
    area: "gut", level: 0, profile: "all", type: "lab",
    es: { title: "Sangre oculta en heces", description: "Tamizaje digestivo", category: "Digestivo" },
    en: { title: "Fecal occult blood", description: "Digestive screening", category: "Digestive" },
  },
  {
    id: "b12",
    area: "blood", level: 0, profile: "all", type: "lab",
    es: { title: "Vitamina B12", description: "Energía y sistema nervioso", category: "Vitaminas" },
    en: { title: "Vitamin B12", description: "Energy and nervous system", category: "Vitamins" },
  },
  {
    id: "vitamin-d",
    area: "blood", level: 0, profile: "all", type: "lab",
    es: { title: "Vitamina D 25", description: "Huesos y defensas", category: "Vitaminas" },
    en: { title: "Vitamin D (25-OH)", description: "Bones and immunity", category: "Vitamins" },
  },
  {
    id: "ferritin",
    area: "blood", level: 0, profile: "all", type: "lab",
    es: { title: "Ferritina", description: "Tus reservas de hierro", category: "Hierro" },
    en: { title: "Ferritin", description: "Your iron stores", category: "Iron" },
  },
  {
    id: "ekg",
    area: "heart", level: 1, profile: "all", type: "diagnostic",
    es: { title: "Electrocardiograma (EKG)", description: "Ritmo y actividad del corazón", category: "Corazón" },
    en: { title: "Electrocardiogram (EKG)", description: "Heart rhythm and activity", category: "Heart" },
  },
  {
    id: "abdominal-ultrasound",
    area: "liver", level: 1, profile: "all", type: "diagnostic",
    es: { title: "Ecografía de abdomen", description: "Hígado, vesícula, riñones y páncreas", category: "Imagen" },
    en: { title: "Abdominal ultrasound", description: "Liver, gallbladder, kidneys and pancreas", category: "Imaging" },
  },
  {
    id: "chest-xray",
    area: "lungs", level: 1, profile: "all", type: "diagnostic",
    es: { title: "Rayos X de tórax", description: "Pulmones y corazón", category: "Imagen" },
    en: { title: "Chest X-ray", description: "Lungs and heart", category: "Imaging" },
  },
  {
    id: "stress-test",
    area: "heart", level: 2, profile: "all", type: "diagnostic",
    es: { title: "Prueba de esfuerzo", description: "Tu corazón en ejercicio", category: "Corazón" },
    en: { title: "Stress test", description: "Your heart during exercise", category: "Heart" },
  },
  {
    id: "breast-ultrasound",
    area: "breast", level: 2, profile: "female", type: "diagnostic",
    es: { title: "Ecografía de mama", description: "Tamizaje mamario", category: "Mujer" },
    en: { title: "Breast ultrasound", description: "Breast screening", category: "Female" },
  },
];

export function formatCheckupAmount(amount: number, locale: SiteLocale) {
  return new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US").format(amount);
}
